// actions/server-actions.ts
'use server'

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';

// Company registration function
export async function registerCompanyAction(formData: FormData) {
  try {
    // Extract form data
    const walletAddress = formData.get('wallet_address');
    const companyName = formData.get('company_name');
    const industry = formData.get('industry');
    const contactName = formData.get('contact_name');
    const email = formData.get('email');
    const description = formData.get('description') || '';
    
    console.log('Registering company with data:', { 
      walletAddress, companyName, industry, contactName, email 
    });
    
    // Validate required fields
    if (!walletAddress || !companyName || !industry || !contactName || !email) {
      throw new Error('Missing required fields');
    }
    
    console.log('Attempting to insert into database...');
    
    // Insert into database with Prisma
    const company = await prisma.company.create({
      data: {
        walletAddress: walletAddress.toString(),
        companyName: companyName.toString(),
        industry: industry.toString(),
        contactName: contactName.toString(),
        email: email.toString(),
        description: description.toString()
      }
    });
    
    if (!company) {
      throw new Error('No data returned from database after successful insert');
    }
    
    console.log('Company registered successfully:', company);
    
    // Store company ID in a cookie for future requests
    cookies().set('company_id', company.id, { 
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'strict'
    });
    
    revalidatePath('/onboarding/company');
    redirect('/onboarding/company/project');
  } catch (error) {
    console.error('Error registering company:', error);
    throw error;
  }
}

// Project creation function
export async function createProjectAction(formData: FormData) {
  try {
    const companyId = cookies().get('company_id')?.value;
    
    if (!companyId) {
      throw new Error('Company ID not found. Please register first.');
    }
    
    const projectName = formData.get('project_name');
    const projectType = formData.get('project_type');
    const projectDescription = formData.get('project_description');
    const estimatedItems = parseInt(formData.get('estimated_items') as string) || 0;
    const qualityRequirement = formData.get('quality_requirement');
    const instructions = formData.get('instructions');
    
    // Validate required fields
    if (!projectName || !projectType || !projectDescription || !estimatedItems || !qualityRequirement || !instructions) {
      throw new Error('Missing required fields');
    }
    
    // Insert into database with Prisma
    const project = await prisma.project.create({
      data: {
        companyId: companyId,
        name: projectName.toString(),
        type: projectType.toString(),
        description: projectDescription.toString(),
        estimatedItems: estimatedItems,
        qualityRequirement: qualityRequirement.toString(),
        instructions: instructions.toString(),
        status: 'draft',
        fileUrls: []
      }
    });
    
    // Store project ID in a cookie for the upload step
    cookies().set('project_id', project.id, { 
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
      sameSite: 'strict'
    });
    
    return project.id; // Return the project ID for file uploads
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

// Upload file to Digital Ocean Spaces
export async function uploadFileToSpaces(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    const projectId = formData.get('projectId') as string;
    
    if (!file || !projectId) {
      throw new Error('File or projectId is missing');
    }
    
    const region = process.env.DO_SPACES_REGION || 'blr1';
    const accessKeyId = process.env.DO_SPACES_ACCESS_KEY;
    const secretAccessKey = process.env.DO_SPACES_SECRET_KEY;
    const bucketName = process.env.DO_SPACES_BUCKET_NAME || 'labelingv2';

    if (!accessKeyId || !secretAccessKey) {
      throw new Error('Digital Ocean Spaces credentials are missing');
    }

    const client = new S3Client({
      region,
      endpoint: `https://${region}.digitaloceanspaces.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    const extension = file.name.split('.').pop();
    const uniqueId = uuidv4();
    const key = `projects/${projectId}/${uniqueId}.${extension}`;
    
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log(`Uploading file ${file.name} to ${key}`);

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      ACL: 'public-read',
    });

    await client.send(command);
    
    const fileUrl = `https://${bucketName}.${region}.digitaloceanspaces.com/${key}`;
    console.log(`File uploaded successfully: ${fileUrl}`);
    
    // Update the project's file_urls array with Prisma
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { fileUrls: true }
    });
    
    if (!project) {
      throw new Error(`Project with ID ${projectId} not found`);
    }
    
    const fileUrls = project.fileUrls || [];
    fileUrls.push(fileUrl);
    
    await prisma.project.update({
      where: { id: projectId },
      data: { fileUrls: fileUrls }
    });
    
    return { success: true, fileUrl };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { success: false, error: (error as Error).message };
  }
}

// Project funding function
export async function fundProjectAction(amount: string, txSignature: string) {
  try {
    const projectId = cookies().get('project_id')?.value;
    
    if (!projectId) {
      throw new Error('Project ID not found');
    }
    
    const amountValue = parseFloat(amount);
    
    if (isNaN(amountValue) || amountValue <= 0) {
      throw new Error('Invalid amount');
    }
    
    // Calculate estimated completion based on amount
    const pricePerItem = 0.12;
    const estimatedItems = Math.floor(amountValue / pricePerItem);
    const estimatedDays = Math.ceil(estimatedItems / 5000);
    
    const today = new Date();
    const completionDate = new Date();
    completionDate.setDate(today.getDate() + estimatedDays);
    
    // Update project in database with Prisma
    await prisma.project.update({
      where: { id: projectId },
      data: {
        status: 'funded',
        paymentAmount: amountValue,
        itemsCompleted: 0,
        estimatedCompletionDate: completionDate,
        transactionSignature: txSignature
      }
    });
    
    // Clear the project_id cookie since onboarding is complete
    cookies().delete('project_id');
    
    revalidatePath('/onboarding/company/payment');
    return { success: true };
  } catch (error) {
    console.error('Error funding project:', error);
    return { success: false, error: (error as Error).message };
  }
}