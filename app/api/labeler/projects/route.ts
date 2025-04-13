
// app/api/labeler/projects/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Get labeler ID from cookies
    const labelerId = cookies().get('labeler_id')?.value;
    const walletAddress = cookies().get('wallet_address')?.value;
    
    if (!labelerId && !walletAddress) {
      return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
    }
    
    // Fetch labeler information
    const labeler = labelerId ? 
      await prisma.labeler.findUnique({ where: { id: labelerId } }) :
      await prisma.labeler.findUnique({ where: { walletAddress: walletAddress as string } });
    
    if (!labeler) {
      return NextResponse.json({ error: 'Labeler not found' }, { status: 404 });
    }
    
    // Get filter parameters
    const status = request.nextUrl.searchParams.get('status');
    const type = request.nextUrl.searchParams.get('type');
    
    // Build query based on filters
    let whereClause: any = {
      status: 'funded'  // Only show funded projects
    };
    
    if (type) {
      whereClause.type = type;
    }
    
    // Get projects that match labeler skills if possible
    const projects = await prisma.project.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Get labeler's assigned tasks 
    const assignedTasks = await prisma.task.findMany({
      where: {
        labelerId: labeler.id
      },
      include: {
        project: true
      }
    });
    
    // Group tasks by project
    const activeProjects = assignedTasks.reduce((acc, task) => {
      if (!acc[task.projectId]) {
        acc[task.projectId] = {
          project: task.project,
          tasksCompleted: 0,
          tasksTotal: 0,
          earnings: 0
        };
      }
      
      acc[task.projectId].tasksTotal++;
      
      if (task.status === 'completed') {
        acc[task.projectId].tasksCompleted++;
        acc[task.projectId].earnings += task.paymentAmount || 0;
      }
      
      return acc;
    }, {} as Record<string, any>);
    
    return NextResponse.json({
      success: true,
      availableProjects: projects,
      activeProjects: Object.values(activeProjects)
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}