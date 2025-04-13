import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const walletAddress = request.nextUrl.searchParams.get('wallet');
  
  if (!walletAddress) {
    return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
  }
  
  try {
    // Find company by wallet address
    const company = await prisma.company.findUnique({
      where: { walletAddress }
    });
    
    if (!company) {
      return NextResponse.json({ found: false }, { status: 404 });
    }
    
    // Find company's projects
    const projects = await prisma.project.findMany({
      where: { companyId: company.id },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json({
      found: true,
      company,
      projects
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}