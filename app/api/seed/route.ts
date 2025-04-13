import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const isDevMode = process.env.NODE_ENV === 'development';
  
  // Only allow in development mode
  if (!isDevMode) {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }
  
  try {
    // Get wallet address from query parameter or use default
    const walletAddress = request.nextUrl.searchParams.get('wallet') || '7YQbJcSKJJkXVSDrYs8ghRuGVh6qNrt7XLKMioQCpzqZ';
    
    // Check if we already have a company with this wallet
    const existingCompany = await prisma.company.findUnique({
      where: { walletAddress }
    });
    
    if (existingCompany) {
      return NextResponse.json({
        message: 'Company already exists',
        companyId: existingCompany.id
      });
    }
    
    // Create a test company
    const company = await prisma.company.create({
      data: {
        walletAddress,
        companyName: 'Test Company',
        industry: 'ai-ml',
        contactName: 'Test User',
        email: 'test@example.com',
        description: 'This is a test company for development purposes'
      }
    });
    
    // Create some test projects
    const projects = await Promise.all([
      // Completed project
      prisma.project.create({
        data: {
          companyId: company.id,
          name: 'Image Classification Project',
          type: 'image-classification',
          description: 'A completed project for testing',
          estimatedItems: 1000,
          qualityRequirement: 'high',
          instructions: 'Classify images into different categories',
          status: 'completed',
          fileUrls: ['https://example.com/test1.jpg', 'https://example.com/test2.jpg'],
          paymentAmount: 500,
          itemsCompleted: 1000,
          estimatedCompletionDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          transactionSignature: 'test-tx-signature-1'
        }
      }),
      
      // In progress project
      prisma.project.create({
        data: {
          companyId: company.id,
          name: 'Object Detection Project',
          type: 'object-detection',
          description: 'An in-progress project for testing',
          estimatedItems: 2000,
          qualityRequirement: 'high',
          instructions: 'Detect objects in images and draw bounding boxes',
          status: 'in_progress',
          fileUrls: ['https://example.com/test3.jpg'],
          paymentAmount: 800,
          itemsCompleted: 600,
          estimatedCompletionDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
          transactionSignature: 'test-tx-signature-2'
        }
      }),
      
      // Funded project
      prisma.project.create({
        data: {
          companyId: company.id,
          name: 'Text Annotation Project',
          type: 'text-annotation',
          description: 'A funded project ready to start',
          estimatedItems: 5000,
          qualityRequirement: 'standard',
          instructions: 'Annotate text with named entities',
          status: 'funded',
          fileUrls: [],
          paymentAmount: 1200,
          itemsCompleted: 0,
          estimatedCompletionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          transactionSignature: 'test-tx-signature-3'
        }
      })
    ]);
    
    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      company,
      projects: projects.length
    });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
