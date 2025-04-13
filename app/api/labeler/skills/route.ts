// app/api/labeler/skills/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Get labeler ID from cookies
    const labelerId = cookies().get('labeler_id')?.value;
    
    if (!labelerId) {
      return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
    }
    
    // Get selected skills
    const skills = formData.getAll('skills') as string[];
    const availableHours = formData.get('hours_per_week') as string;
    const preferredTime = formData.get('preferred_time') as string;
    const education = formData.get('education') as string;
    const experience = formData.get('prior_experience') as string;
    const experienceDescription = formData.get('experience_description') as string;
    const deviceType = formData.get('device_type') as string;
    const internetSpeed = formData.get('internet_speed') as string;
    
    // Update labeler profile
    const updatedLabeler = await prisma.labeler.update({
      where: { id: labelerId },
      data: {
        skills,
        availableHours,
        preferredTime,
        education,
        experience,
        experienceDescription,
        deviceType,
        internetSpeed
      }
    });
    
    return NextResponse.json({
      success: true,
      labeler: updatedLabeler
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}