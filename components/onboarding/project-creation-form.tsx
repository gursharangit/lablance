"use client";
// components/onboarding/project-creation-form.tsx
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Upload, ImageIcon, FileText, FileCode, AlertCircle, PenLine, Loader2, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { createProjectAction, uploadFileToSpaces } from "@/actions/server-actions";
import { Progress } from "@/components/ui/progress";
import { cookies } from "next/headers";

interface ProjectCreationFormProps {
  companyId?: string;
  redirectPath?: string;
  isExistingCompany?: boolean;
}

export function ProjectCreationForm({ 
  companyId = "", 
  redirectPath = "/onboarding/company/payment",
  isExistingCompany = false
}: ProjectCreationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [projectType, setProjectType] = useState<string>("");
  const [projectName, setProjectName] = useState<string>("");
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [estimatedItems, setEstimatedItems] = useState<string>(""); 
  const [qualityRequirement, setQualityRequirement] = useState<string>("");
  const [instructions, setInstructions] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [formError, setFormError] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<number>(0);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileArray = Array.from(e.target.files);
      setFiles(fileArray);
    }
  };

  const uploadFiles = async (projectId: string) => {
    if (files.length === 0) {
      return true; // No files to upload is considered success
    }
    
    setUploadStatus("Uploading files...");
    setUploadedFiles(0);
    
    // Upload files one by one
    for (let i = 0; i < files.length; i++) {
      try {
        const formData = new FormData();
        formData.append('file', files[i]);
        formData.append('projectId', projectId);
        
        const result = await uploadFileToSpaces(formData);
        
        if (!result.success) {
          throw new Error(`Failed to upload file: ${result.error}`);
        }
        
        // Update progress
        setUploadedFiles(i + 1);
        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      } catch (error) {
        console.error(`Error uploading file ${files[i].name}:`, error);
        setFormError(`Error uploading file ${files[i].name}: ${(error as Error).message}`);
        return false;
      }
    }
    
    setUploadStatus("All files uploaded successfully!");
    return true;
  };

  const createProject = async (formData: FormData) => {
    // If companyId is provided (for existing companies), add it to form data
    if (companyId && isExistingCompany) {
      formData.append('company_id', companyId);
    }
    
    // For existing companies creating projects directly, we'll use a different API route
    if (isExistingCompany) {
      try {
        const response = await fetch('/api/projects', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to create project');
        }
        
        const data = await response.json();
        return data.project.id;
      } catch (error) {
        console.error('Error creating project:', error);
        throw error;
      }
    } else {
      // Use the server action for new companies during onboarding
      return await createProjectAction(formData);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (files.length === 0 && !isExistingCompany) {
      setFormError("Please upload at least one sample file");
      return;
    }
    
    setIsLoading(true);
    setFormError(null);
    
    try {
      const formData = new FormData(formRef.current!);
      
      // Save project details to session storage for the payment page
      const projectDetails = {
        name: projectName,
        type: projectType,
        description: projectDescription,
        estimatedItems: parseInt(estimatedItems),
        qualityRequirement: qualityRequirement,
        instructions: instructions
      };
      
      if (!isExistingCompany) {
        sessionStorage.setItem('current_project_details', JSON.stringify(projectDetails));
        
        // Also save individual values in case the JSON parsing fails
        sessionStorage.setItem('project_name', projectName);
        sessionStorage.setItem('project_type', projectType);
        sessionStorage.setItem('quality_requirement', qualityRequirement);
        sessionStorage.setItem('estimated_items', estimatedItems);
      }
      
      // First, create the project
      setUploadStatus("Creating project...");
      const projectId = await createProject(formData);
      
      if (!projectId) {
        throw new Error("Failed to create project");
      }
      
      // Then upload all files
      const uploadSuccess = await uploadFiles(projectId);
      
      if (uploadSuccess) {
        // Redirect to the specified path
        router.push(redirectPath);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setFormError((error as Error).message || "Failed to create project. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <Card className="border-secondary">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <FileText className="mr-2 h-6 w-6 text-primary" />
            Project Details
          </CardTitle>
          <CardDescription>
            Tell us about the data you need labeled
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {formError && (
            <div className="bg-destructive/10 p-3 rounded-md border border-destructive/20 flex items-center">
              <AlertCircle className="h-5 w-5 text-destructive mr-2" />
              <p className="text-destructive text-sm">{formError}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="project_name">Project Name</Label>
              <Input 
                id="project_name" 
                name="project_name" 
                placeholder="Skin Condition Detection" 
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="project_type">Project Type</Label>
              <Select 
                name="project_type" 
                required 
                value={projectType} 
                onValueChange={setProjectType}
              >
                <SelectTrigger id="project_type">
                  <SelectValue placeholder="Select a project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image-classification">Image Classification</SelectItem>
                  <SelectItem value="object-detection">Object Detection</SelectItem>
                  <SelectItem value="text-annotation">Text Annotation</SelectItem>
                  <SelectItem value="audio-transcription">Audio Transcription</SelectItem>
                  <SelectItem value="data-cleaning">Data Cleaning</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="project_description">Project Description</Label>
            <Textarea 
              id="project_description" 
              name="project_description" 
              placeholder="Describe your project and the type of labeling you need..."
              className="min-h-[100px]"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="estimated_items">Estimated # of Items</Label>
              <Input 
                id="estimated_items" 
                name="estimated_items" 
                type="number" 
                placeholder="e.g., 5000" 
                value={estimatedItems}
                onChange={(e) => setEstimatedItems(e.target.value)}
                required 
              />
              <p className="text-xs text-muted-foreground">
                This will be used to calculate the funding amount in the next step.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quality_requirement">Quality Requirement</Label>
              <Select 
                name="quality_requirement" 
                required
                value={qualityRequirement}
                onValueChange={setQualityRequirement}
              >
                <SelectTrigger id="quality_requirement">
                  <SelectValue placeholder="Select quality level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard (90% accuracy)</SelectItem>
                  <SelectItem value="high">High (95% accuracy)</SelectItem>
                  <SelectItem value="premium">Premium (98% accuracy)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Separator className="my-2" />
          
          <div className="space-y-4">
            <div className="flex items-center">
              <Upload className="mr-2 h-5 w-5 text-primary" />
              <Label>Sample Data Upload</Label>
            </div>
            
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <div className="flex flex-col items-center justify-center">
                {projectType === "image-classification" || projectType === "object-detection" ? (
                  <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                ) : projectType === "text-annotation" || projectType === "data-cleaning" ? (
                  <FileCode className="h-10 w-10 text-muted-foreground mb-2" />
                ) : (
                  <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                )}
                
                <p className="mb-4 text-sm text-muted-foreground font-medium">
                  {files.length > 0 ? `${files.length} file(s) selected` : "Drag and drop your sample data files, or click to browse"}
                </p>
                
                {files.length > 0 && (
                  <div className="w-full mb-4">
                    <ul className="text-left text-sm space-y-1 max-h-32 overflow-y-auto bg-muted/30 p-2 rounded-md">
                      {files.map((file, index) => (
                        <li key={index} className="truncate">
                          {file.name} ({(file.size / 1024).toFixed(1)} KB)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <Input
                  id="file-upload"
                  name="files"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  Select Files
                </Button>
              </div>
            </div>
            
            <div className="flex items-start space-x-2 bg-muted/50 p-3 rounded-md">
              <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
              <p className="text-sm text-muted-foreground">
                {isExistingCompany 
                  ? "Upload sample files that represent your dataset to help our labelers understand your requirements." 
                  : "Upload 5-10 sample files that represent your dataset. This helps us understand your requirements better and provide accurate pricing."}
              </p>
            </div>
          </div>
          
          <Separator className="my-2" />
          
          <div className="space-y-4">
            <div className="flex items-center">
              <PenLine className="mr-2 h-5 w-5 text-primary" />
              <Label>Labeling Instructions</Label>
            </div>
            
            <Textarea 
              name="instructions"
              placeholder="Provide detailed instructions for labelers (e.g., 'Draw bounding boxes around all vehicles in the image and classify them as car, truck, motorcycle, or bicycle')"
              className="min-h-[120px]"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              required
            />
          </div>
          
          {isLoading && (
            <div className="space-y-3 mt-4 bg-muted/30 p-4 rounded-md border border-muted">
              <p className="text-sm font-medium">{uploadStatus}</p>
              {files.length > 0 && (
                <>
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {uploadedFiles} of {files.length} files uploaded ({uploadProgress}%)
                  </p>
                </>
              )}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between pt-6">
          <Button variant="outline" type="button" asChild>
            <Link href={isExistingCompany ? "/company/dashboard" : "/onboarding/company"}>
              Back
            </Link>
          </Button>
          
          <Button 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {isExistingCompany ? "Create Project" : "Continue to Payment"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
