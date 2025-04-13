"use client";
// components/dashboard/company-dashboard.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Clock, 
  Download, 
  FileCheck, 
  FilePlus, 
  Loader2, 
  Info, 
  BarChart3, 
  ListFilter, 
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { WalletConnectButton } from "@/components/solana/wallet-connect-button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { getCompanyByWallet, getCompanyProjects, CompanyProfile, Project } from "@/lib/db-client";

export function CompanyDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { publicKey } = useWallet();
  const router = useRouter();
  
  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!publicKey) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Dashboard: Fetching data for wallet', publicKey.toString());
        
        // Use the API endpoint to get company and projects in one call
        const response = await fetch(`/api/company?wallet=${encodeURIComponent(publicKey.toString())}`);
        const data = await response.json();
        
        if (!response.ok) {
          if (response.status === 404) {
            console.log('No company found, redirecting to onboarding');
            router.push("/onboarding/company");
            return;
          }
          throw new Error(`API error: ${data.error || response.statusText}`);
        }
        
        if (!data.found) {
          console.log('No company found, redirecting to onboarding');
          router.push("/onboarding/company");
          return;
        }
        
        console.log('Company data received:', data.company ? 'Yes' : 'No');
        setCompany(data.company);
        
        console.log('Projects received:', data.projects?.length || 0);
        setProjects(data.projects || []);
      } catch (error) {
        console.error("Error fetching company data:", error);
        
        // More detailed error reporting
        let errorMessage = "Failed to load dashboard data. Please try again later.";
        if (error instanceof Error) {
          errorMessage = `${errorMessage} Details: ${error.message}`;
          console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
          });
        }
        
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCompanyData();
  }, [publicKey, router]);
  
  // Calculate dashboard stats
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'in_progress').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const totalItems = projects.reduce((acc, p) => acc + p.estimatedItems, 0);
  const completedItems = projects.reduce((acc, p) => acc + (p.itemsCompleted || 0), 0);
  const totalSpent = projects.reduce((acc, p) => acc + (p.paymentAmount || 0), 0);
  
  // Helper function to format date
  const formatDate = (dateString?: Date) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Calculate completion percentage
  const getCompletionPercentage = (project: Project) => {
    if (!project.itemsCompleted || project.estimatedItems === 0) return 0;
    return Math.min(100, Math.round((project.itemsCompleted / project.estimatedItems) * 100));
  };
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return "bg-muted text-muted-foreground";
      case 'funded': return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case 'in_progress': return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case 'completed': return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };
  
  if (!publicKey) {
    return (
      <div className="container py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Connect Wallet</CardTitle>
            <CardDescription>
              Please connect your Solana wallet to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-6">
            <WalletConnectButton />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="container py-12 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container py-12">
        <Card className="max-w-md mx-auto border-destructive/50">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-6 w-6 text-destructive" />
              <CardTitle>Error</CardTitle>
            </div>
            <CardDescription>
              {error}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center pb-6">
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container py-12">
      <div className="mt-[30px] flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 ">
        <div>
          <h1 className="text-3xl font-bold">{company?.companyName || "Company"} Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your data labeling projects in real-time
          </p>
        </div>
        
        <Button asChild>
          <Link href="/onboarding/company/project">
            <FilePlus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-muted-foreground">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="mr-4 rounded-full bg-primary/10 p-2">
                <FileCheck className="h-8 w-8 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalProjects}</div>
                <div className="text-xs text-muted-foreground">
                  {activeProjects} active, {completedProjects} completed
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-muted-foreground">Items Labeled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="mr-4 rounded-full bg-primary/10 p-2">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{completedItems.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">
                  {totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0}% of total items
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-muted-foreground">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="mr-4 rounded-full bg-primary/10 p-2">
                <BarChart className="h-8 w-8 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">${totalSpent.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">
                  USDC paid for data labeling
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="active" className="mb-8">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="active">Active Projects</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="all">All Projects</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <ListFilter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        
        <TabsContent value="active" className="mt-4">
          {projects.filter(p => p.status === 'funded' || p.status === 'in_progress').length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No active projects</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  You don&apos;t have any active data labeling projects at the moment. Create a new project to get started.
                </p>
                <Button asChild>
                  <Link href="/company/new-project">
                    <FilePlus className="mr-2 h-4 w-4" />
                    Create New Project
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {projects
                .filter(p => p.status === 'funded' || p.status === 'in_progress')
                .map((project) => (
                  <Card key={project.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-0">
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                          <div>
                            <Link 
                              href={`/company/projects/${project.id}`}
                              className="text-xl font-bold hover:text-primary transition-colors"
                            >
                              {project.name}
                            </Link>
                            <div className="flex items-center mt-1">
                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                                {project.status === 'funded' ? 'Ready to Start' : 'In Progress'}
                              </span>
                              <span className="text-xs text-muted-foreground ml-2">
                                Created on {formatDate(project.createdAt)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="mt-2 md:mt-0">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs"
                              asChild
                            >
                              <Link href={`/company/projects/${project.id}`}>
                                View Details
                              </Link>
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Type</div>
                            <div className="font-medium">{project.type.replace('-', ' ')}</div>
                          </div>
                          
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Items</div>
                            <div className="font-medium">
                              {(project.itemsCompleted || 0).toLocaleString()} / {project.estimatedItems.toLocaleString()}
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Budget</div>
                            <div className="font-medium">${project.paymentAmount?.toLocaleString()} USDC</div>
                          </div>
                          
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Est. Completion</div>
                            <div className="font-medium flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                              {formatDate(project.estimatedCompletionDate)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-1 flex justify-between text-xs">
                          <span>Progress</span>
                          <span>{getCompletionPercentage(project)}%</span>
                        </div>
                        <Progress value={getCompletionPercentage(project)} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="mt-4">
          {projects.filter(p => p.status === 'completed').length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No completed projects yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Your completed projects will appear here once they&apos;re finished.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {projects
                .filter(p => p.status === 'completed')
                .map((project) => (
                  <Card key={project.id} className="border-l-4 border-l-green-500">
                    <CardContent className="p-0">
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                          <div>
                            <Link 
                              href={`/company/projects/${project.id}`}
                              className="text-xl font-bold hover:text-primary transition-colors"
                            >
                              {project.name}
                            </Link>
                            <div className="flex items-center mt-1">
                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                                Completed
                              </span>
                              <span className="text-xs text-muted-foreground ml-2">
                                Completed on {formatDate(project.estimatedCompletionDate)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="mt-2 md:mt-0 flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs"
                              asChild
                            >
                              <Link href={`/company/projects/${project.id}`}>
                                View Details
                              </Link>
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Type</div>
                            <div className="font-medium">{project.type.replace('-', ' ')}</div>
                          </div>
                          
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Items</div>
                            <div className="font-medium">
                              {project.estimatedItems.toLocaleString()}
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Total Spent</div>
                            <div className="font-medium">${project.paymentAmount?.toLocaleString()} USDC</div>
                          </div>
                          
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Completion Date</div>
                            <div className="font-medium">
                              {formatDate(project.estimatedCompletionDate)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="all" className="mt-4">
          {projects.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No projects found</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  You haven&apos;t created any data labeling projects yet. Get started by creating your first project.
                </p>
                <Button asChild>
                  <Link href="/company/new-project">
                    <FilePlus className="mr-2 h-4 w-4" />
                    Create First Project
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <Card 
                  key={project.id} 
                  className={`border-l-4 ${
                    project.status === 'completed' 
                      ? 'border-l-green-500' 
                      : project.status === 'in_progress' 
                        ? 'border-l-primary' 
                        : 'border-l-gray-400'
                  }`}
                >
                  <CardContent className="p-0">
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                        <div>
                          <Link 
                            href={`/company/projects/${project.id}`}
                            className="text-xl font-bold hover:text-primary transition-colors"
                          >
                            {project.name}
                          </Link>
                          <div className="flex items-center mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                              {project.status === 'draft' 
                                ? 'Draft' 
                                : project.status === 'funded' 
                                  ? 'Ready to Start' 
                                  : project.status === 'in_progress' 
                                    ? 'In Progress' 
                                    : 'Completed'
                              }
                            </span>
                            <span className="text-xs text-muted-foreground ml-2">
                              Created on {formatDate(project.createdAt)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-2 md:mt-0">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs"
                            asChild
                          >
                            <Link href={`/company/projects/${project.id}`}>
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Type</div>
                          <div className="font-medium">{project.type.replace('-', ' ')}</div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Items</div>
                          <div className="font-medium">
                            {(project.itemsCompleted || 0).toLocaleString()} / {project.estimatedItems.toLocaleString()}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Budget</div>
                          <div className="font-medium">${project.paymentAmount?.toLocaleString() || 'N/A'} USDC</div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">
                            {project.status === 'completed' ? 'Completion Date' : 'Est. Completion'}
                          </div>
                          <div className="font-medium flex items-center">
                            {project.status !== 'draft' && <Clock className="h-4 w-4 mr-1 text-muted-foreground" />}
                            {formatDate(project.estimatedCompletionDate)}
                          </div>
                        </div>
                      </div>
                      
                      {project.status !== 'draft' && (
                        <>
                          <div className="mb-1 flex justify-between text-xs">
                            <span>Progress</span>
                            <span>{getCompletionPercentage(project)}%</span>
                          </div>
                          <Progress value={getCompletionPercentage(project)} className="h-2" />
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
