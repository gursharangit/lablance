// app/api/projects/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Get companyId from form data or cookies
    let companyId = formData.get('company_id') as string;
    
    // If not provided in form data, try to get from cookie
    if (!companyId) {
      companyId = cookies().get('company_id')?.value as string;
    }
    
    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
    }
    
    const projectName = formData.get('project_name') as string;
    const projectType = formData.get('project_type') as string;
    const projectDescription = formData.get('project_description') as string;
    const estimatedItems = parseInt(formData.get('estimated_items') as string) || 0;
    const qualityRequirement = formData.get('quality_requirement') as string;
    const instructions = formData.get('instructions') as string;
    
    // Validate required fields
    if (!projectName || !projectType || !projectDescription || !estimatedItems || !qualityRequirement || !instructions) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Insert into database with Prisma
    const project = await prisma.project.create({
      data: {
        companyId: companyId,
        name: projectName,
        type: projectType,
        description: projectDescription,
        estimatedItems: estimatedItems,
        qualityRequirement: qualityRequirement,
        instructions: instructions,
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
    
    return NextResponse.json({
      success: true,
      project: project
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }
    
    // Get project from the database
    const project = await prisma.project.findUnique({
      where: { id }
    });
    
    if (!project) {
      return NextResponse.json({ 
        success: false,
        error: 'Project not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      project
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}