// app/api/labeler/tasks/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Get labeler ID from cookies
    const labelerId = cookies().get('labeler_id')?.value;

    if (!labelerId) {
      return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
    }

    // Get project ID from query
    const projectId = request.nextUrl.searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Get assigned tasks for this labeler and project
    const tasks = await prisma.task.findMany({
      where: {
        projectId,
        labelerId
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // If no tasks yet, create a batch and assign to this labeler
    if (tasks.length === 0) {
      // Get project sample files
      let sampleFiles = project.fileUrls || [];

      // If there are no sample files in the project, create dummy URLs for testing
      if (sampleFiles.length === 0) {
        console.log('No file URLs found in project, creating dummy URLs for testing');
        // Use placeholder images for testing
        sampleFiles = [
          'https://placehold.co/600x400?text=Sample+Image+1',
          'https://placehold.co/600x400?text=Sample+Image+2',
          'https://placehold.co/600x400?text=Sample+Image+3',
          'https://placehold.co/600x400?text=Sample+Image+4',
          'https://placehold.co/600x400?text=Sample+Image+5'
        ];
      }

      console.log(`Creating ${Math.min(sampleFiles.length, 10)} tasks for labeler ${labelerId}`);

      // Create tasks for each sample file (normally would be done in batches)
      const newTasks = [];

      try {
        for (let i = 0; i < Math.min(sampleFiles.length, 10); i++) {
          const task = await prisma.task.create({
            data: {
              projectId,
              labelerId,
              fileUrl: sampleFiles[i],
              status: 'pending',
              paymentAmount: 0.10, // $0.10 per task
              batchNumber: 1,
              taskData: {
                instructions: project.instructions,
                projectType: project.type,
                fileIndex: i,
                // Add some defaults for different task types
                options: project.type === 'image-classification' ?
                  ['Car', 'Truck', 'Motorcycle', 'Bicycle', 'Bus', 'Pedestrian', 'Other'] : undefined,
                text: project.type === 'text-annotation' ?
                  'Sample text for annotation task. This is an example sentence with entities to tag.' : undefined
              }
            }
          });

          newTasks.push(task);
        }

        console.log(`Successfully created ${newTasks.length} tasks`);

        return NextResponse.json({
          success: true,
          tasks: newTasks,
          project
        });
      } catch (error) {
        console.error('Error creating tasks:', error);
        return NextResponse.json({
          success: false,
          error: 'Failed to create tasks. Please try again.',
          details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      tasks,
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

export async function POST(request: NextRequest) {
  try {
    // Get labeler ID from cookies
    const labelerId = cookies().get('labeler_id')?.value;

    if (!labelerId) {
      return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
    }

    const body = await request.json();
    const { taskId, result } = body;

    if (!taskId || !result) {
      return NextResponse.json({ error: 'Task ID and result are required' }, { status: 400 });
    }

    // Get task
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true }
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    if (task.labelerId !== labelerId) {
      return NextResponse.json({ error: 'Not authorized to submit this task' }, { status: 403 });
    }

    // Update task with result
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        status: 'completed',
        result,
        completedAt: new Date()
      }
    });

    // Update project completion stats
    await prisma.project.update({
      where: { id: task.projectId },
      data: {
        itemsCompleted: {
          increment: 1
        }
      }
    });

    // Update labeler stats
    await prisma.labeler.update({
      where: { id: labelerId },
      data: {
        tasksCompleted: {
          increment: 1
        },
        totalEarned: {
          increment: task.paymentAmount || 0
        }
      }
    });

    // In a real implementation, this would trigger a payment via Solana
    // For demo purposes, we'll just mark the task as paid
    const paymentResult = {
      success: true,
      amount: task.paymentAmount || 0,
      transactionId: `demo-tx-${Date.now()}`
    };

    return NextResponse.json({
      success: true,
      task: updatedTask,
      payment: paymentResult
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
