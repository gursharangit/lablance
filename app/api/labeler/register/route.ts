// app/api/labeler/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const walletAddress = formData.get('wallet_address') as string;
    const firstName = formData.get('first_name') as string;
    const lastName = formData.get('last_name') as string;
    const email = formData.get('email') as string;
    const country = formData.get('country') as string;
    const primaryLanguage = formData.get('primary_language') as string;
    const englishProficiency = formData.get('english_proficiency') as string;
    
    // Validate required fields
    if (!walletAddress || !firstName || !lastName || !email || !country) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Check if labeler already exists
    const existingLabeler = await prisma.labeler.findUnique({
      where: { walletAddress }
    });
    
    if (existingLabeler) {
      return NextResponse.json({ 
        already_registered: true,
        labeler: existingLabeler 
      });
    }
    
    // Create new labeler
    const labeler = await prisma.labeler.create({
      data: {
        walletAddress,
        firstName,
        lastName,
        email,
        country,
        primaryLanguage,
        englishProficiency,
        skills: [],
        availableHours: formData.get('available_hours') as string || 'flexible',
        rating: 0,
        totalEarned: 0,
        tasksCompleted: 0,
        status: 'active'
      }
    });
    
    return NextResponse.json({
      success: true,
      labeler
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}