// lib/db-client.ts
// This file is for client-side code that interacts with the API

export type CompanyProfile = {
  id?: string;
  walletAddress: string;
  companyName: string;
  industry: string;
  contactName: string;
  email: string;
  description?: string;
  createdAt?: Date;
};

export type Project = {
  id?: string;
  companyId: string;
  name: string;
  type: string;
  description: string;
  estimatedItems: number;
  qualityRequirement: string;
  instructions: string;
  status: 'draft' | 'funded' | 'in_progress' | 'completed';
  createdAt?: Date;
  fileUrls?: string[];
  paymentAmount?: number;
  itemsCompleted?: number;
  estimatedCompletionDate?: Date;
  transactionSignature?: string;
};

export async function getCompanyByWallet(walletAddress: string): Promise<CompanyProfile | null> {
  try {
    console.log(`Fetching company for wallet: ${walletAddress}`);
    
    const response = await fetch(`/api/company?wallet=${encodeURIComponent(walletAddress)}`);
    const data = await response.json();
    
    if (!response.ok) {
      if (response.status === 404) {
        console.log('Company not found');
        return null;
      }
      throw new Error(`API error: ${data.error || response.statusText}`);
    }
    
    if (!data.found || !data.company) {
      console.log('Company not found in response');
      return null;
    }
    
    console.log('Company found');
    return data.company;
  } catch (error) {
    console.error('Error fetching company by wallet:', error);
    throw error;
  }
}

export async function getCompanyProjects(companyId: string): Promise<Project[]> {
  try {
    console.log(`Fetching projects for company: ${companyId}`);
    
    // Since we're already getting projects in the company API call,
    // we'll use local storage as a cache
    const cachedData = sessionStorage.getItem(`company_${companyId}_projects`);
    if (cachedData) {
      const projects = JSON.parse(cachedData);
      console.log(`Found ${projects.length} projects in cache`);
      return projects;
    }
    
    // If we don't have cached data, get it from the API
    const response = await fetch(`/api/company?wallet=${encodeURIComponent(companyId)}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`API error: ${data.error || response.statusText}`);
    }
    
    if (!data.projects) {
      console.log('No projects found');
      return [];
    }
    
    // Store in session storage for next time
    sessionStorage.setItem(`company_${companyId}_projects`, JSON.stringify(data.projects));
    
    console.log(`Found ${data.projects.length} projects`);
    return data.projects;
  } catch (error) {
    console.error('Error fetching company projects:', error);
    throw error;
  }
}