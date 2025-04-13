import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const walletAddress = request.nextUrl.searchParams.get('wallet');
    
    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
    }
    
    const company = await prisma.company.findUnique({
      where: { walletAddress },
      include: {
        projects: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    
    if (!company) {
      return NextResponse.json({ found: false }, { status: 404 });
    }
    
    return NextResponse.json({
      found: true,
      company,
      projects: company.projects || []
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}