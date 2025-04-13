// app/company/projects/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { FileText, Download, Image as ImageIcon, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Project } from "@/lib/db-client";

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!params.id) return;
      
      try {
        setIsLoading(true);
        setError(null);

        console.log('Fetching project details for:', params.id);
        const response = await fetch(`/api/projects/${params.id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Project not found');
          }
          throw new Error(`Failed to fetch project details: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Project data received:', data);
        
        if (!data.success || !data.project) {
          throw new Error('Invalid response format');
        }
        
        setProject(data.project);
      } catch (error) {
        console.error('Error fetching project details:', error);
        setError((error as Error).message || 'Failed to load project details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectDetails();
  }, [params.id]);

  const formatDate = (dateString?: Date | string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="container py-12 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container py-12">
        <div className="bg-destructive/10 p-4 rounded-md border border-destructive/20 text-center max-w-md mx-auto">
          <p className="text-destructive mb-4">{error || "Failed to load project details. Please try again."}</p>
          <Button variant="outline" onClick={() => router.push("/company/dashboard")}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Calculate completion percentage
  const completionPercentage = project.itemsCompleted 
    ? Math.min(100, Math.round((project.itemsCompleted / project.estimatedItems) * 100))
    : 0;

  return (
    <div className="container py-12 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{project.name}</h1>
        <Button asChild>
          <Link href={`/company/projects/${params.id}/edit`}>Edit Project</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-muted-foreground">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {project.status.replace('_', ' ')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-muted-foreground">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{project.itemsCompleted || 0} of {project.estimatedItems} items</span>
                <span>{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-muted-foreground">Estimated Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDate(project.estimatedCompletionDate)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-1">Description</h3>
            <p className="text-muted-foreground">{project.description}</p>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-1">Project Type</h3>
            <p className="text-muted-foreground capitalize">{project.type.replace('-', ' ')}</p>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-1">Quality Requirement</h3>
            <p className="text-muted-foreground capitalize">{project.qualityRequirement}</p>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-1">Instructions for Labelers</h3>
            <p className="text-muted-foreground">{project.instructions}</p>
          </div>

          {project.paymentAmount && (
            <>
              <Separator />
              <div>
                <h3 className="font-medium mb-1">Budget</h3>
                <p className="text-muted-foreground">{project.paymentAmount.toLocaleString()} USDC</p>
              </div>
            </>
          )}

          {project.transactionSignature && (
            <>
              <Separator />
              <div>
                <h3 className="font-medium mb-1">Transaction</h3>
                <p className="text-muted-foreground font-mono text-sm">{project.transactionSignature}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Sample Files
          </CardTitle>
        </CardHeader>
        <CardContent>
          {project.fileUrls && project.fileUrls.length > 0 ? (
            <div>
              <div className="mb-4">
                <p className="text-muted-foreground">
                  {project.fileUrls.length} sample file(s) uploaded
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {project.fileUrls.map((url, index) => {
                  const isImage = url.match(/\.(jpeg|jpg|gif|png)$/i);
                  return (
                    <div key={index} className="border rounded-md overflow-hidden group relative">
                      {isImage ? (
                        <div className="aspect-square relative">
                          <Image 
                            src={url} 
                            alt={`Sample file ${index + 1}`}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                      ) : (
                        <div className="aspect-square flex items-center justify-center bg-muted/30">
                          <FileText className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      <div className="p-2 text-xs flex justify-between items-center">
                        <span className="truncate">File {index + 1}</span>
                        <a 
                          href={url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No sample files uploaded</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}