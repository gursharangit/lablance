// app/api/labeler/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Get wallet address or labeler id from cookies
    const walletAddress = cookies().get('wallet_address')?.value;
    const labelerId = cookies().get('labeler_id')?.value;
    
    if (!walletAddress && !labelerId) {
      return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
    }
    
    // Find labeler
    const labeler = labelerId ? 
      await prisma.labeler.findUnique({ where: { id: labelerId } }) :
      await prisma.labeler.findUnique({ where: { walletAddress: walletAddress as string } });
    
    if (!labeler) {
      return NextResponse.json({ error: 'Labeler not found' }, { status: 404 });
    }
    
    // Get labeler stats
    const completedTasks = await prisma.task.count({
      where: {
        labelerId: labeler.id,
        status: 'completed'
      }
    });
    
    const totalEarned = await prisma.task.aggregate({
      where: {
        labelerId: labeler.id,
        status: 'completed'
      },
      _sum: {
        paymentAmount: true
      }
    });
    
    // Get projects the labeler has worked on
    const projectIds = await prisma.task.findMany({
      where: {
        labelerId: labeler.id
      },
      distinct: ['projectId'],
      select: {
        projectId: true
      }
    });
    
    const projectCount = projectIds.length;
    
    // Return labeler profile with stats
    return NextResponse.json({
      success: true,
      profile: {
        ...labeler,
        stats: {
          completedTasks,
          totalEarned: totalEarned._sum.paymentAmount || 0,
          projectCount
        }
      }
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get labeler ID from cookies
    const labelerId = cookies().get('labeler_id')?.value;
    
    if (!labelerId) {
      return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
    }
    
    const body = await request.json();
    
    // Update labeler profile
    const updatedLabeler = await prisma.labeler.update({
      where: { id: labelerId },
      data: {
        ...body,
        // Don't allow updating these fields from this endpoint
        walletAddress: undefined,
        tasksCompleted: undefined,
        totalEarned: undefined,
        rating: undefined
      }
    });
    
    return NextResponse.json({
      success: true,
      profile: updatedLabeler
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
