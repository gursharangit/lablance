"use client";
// components/onboarding/labeler-skills-form.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Clock, AlertCircle, BadgeCheck, GraduationCap, Briefcase, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

// Project types with icons for better UX
const PROJECT_TYPES = [
  { id: 'image-classification', label: 'Image Classification', description: 'Categorize images into predefined classes' },
  { id: 'object-detection', label: 'Object Detection', description: 'Draw bounding boxes around objects in images' },
  { id: 'text-annotation', label: 'Text Annotation', description: 'Label text with entities, sentiments, or other attributes' },
  { id: 'audio-transcription', label: 'Audio Transcription', description: 'Convert spoken audio to written text' },
  { id: 'data-cleaning', label: 'Data Cleaning', description: 'Identify and correct errors in datasets' },
  { id: 'sentiment-analysis', label: 'Sentiment Analysis', description: 'Analyze text for emotion or opinion' },
  { id: 'video-annotation', label: 'Video Annotation', description: 'Label objects or actions in video frames' },
  { id: 'image-segmentation', label: 'Image Segmentation', description: 'Mark exact boundaries of objects in images' },
];

export function LabelerSkillsForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [hoursPerWeek, setHoursPerWeek] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [education, setEducation] = useState('');
  const [priorExperience, setPriorExperience] = useState('');
  const [experienceDescription, setExperienceDescription] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [internetSpeed, setInternetSpeed] = useState('');
  
  const router = useRouter();
  
  // Modified skill toggle function to prevent infinite updates
  const handleSkillToggle = (skillId: string) => {
    // Use the callback form of setState to avoid closure issues
    setSelectedSkills(prevSkills => {
      if (prevSkills.includes(skillId)) {
        return prevSkills.filter(id => id !== skillId);
      } else {
        return [...prevSkills, skillId];
      }
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedSkills.length === 0) {
      setFormError("Please select at least one skill");
      return;
    }
    
    setIsLoading(true);
    setFormError(null);
    
    try {
      // Create form data
      const formData = new FormData();
      
      // Add each skill as a separate entry
      selectedSkills.forEach(skill => {
        formData.append('skills', skill);
      });
      
      formData.append('hours_per_week', hoursPerWeek);
      formData.append('preferred_time', preferredTime);
      formData.append('education', education);
      formData.append('prior_experience', priorExperience);
      formData.append('experience_description', experienceDescription);
      formData.append('device_type', deviceType);
      formData.append('internet_speed', internetSpeed);
      
      // Submit to API
      const response = await fetch('/api/labeler/skills', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update skills');
      }
      
      // Continue to tutorial
      router.push('/onboarding/labeler/tutorial');
    } catch (error) {
      console.error('Error updating skills:', error);
      setFormError((error as Error).message || "Failed to update skills. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="border-secondary">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Sparkles className="mr-2 h-6 w-6 text-primary" />
            Skills & Experience
          </CardTitle>
          <CardDescription>
            Tell us about your skills and experience to help us match you with suitable projects
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {formError && (
            <div className="bg-destructive/10 p-3 rounded-md border border-destructive/20 flex items-center">
              <AlertCircle className="h-5 w-5 text-destructive mr-2" />
              <p className="text-destructive text-sm">{formError}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <Label className="flex items-center">
              <BadgeCheck className="mr-2 h-5 w-5 text-primary" />
              Select Tasks You Can Perform
            </Label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PROJECT_TYPES.map((type) => (
                <div 
                  key={type.id}
                  className={`flex items-start space-x-3 p-3 rounded-md border cursor-pointer hover:bg-primary/5 transition-colors ${
                    selectedSkills.includes(type.id) ? 'border-primary bg-primary/10' : 'border-muted'
                  }`}
                >
                  <Checkbox 
                    id={`skill-${type.id}`}
                    checked={selectedSkills.includes(type.id)} 
                    onCheckedChange={() => handleSkillToggle(type.id)}
                    className="mt-1"
                  />
                  <div 
                    className="flex-1"
                    onClick={() => handleSkillToggle(type.id)}
                  >
                    <label 
                      htmlFor={`skill-${type.id}`} 
                      className="font-medium cursor-pointer"
                    >
                      {type.label}
                    </label>
                    <p className="text-xs text-muted-foreground">{type.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Separator className="my-2" />
          
          <div className="space-y-4">
            <Label className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-primary" />
              Availability
            </Label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="hours-per-week">Hours Available Per Week</Label>
                <Select
                  value={hoursPerWeek}
                  onValueChange={setHoursPerWeek}
                  required
                >
                  <SelectTrigger id="hours-per-week">
                    <SelectValue placeholder="Select hours" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-5">1-5 hours</SelectItem>
                    <SelectItem value="5-10">5-10 hours</SelectItem>
                    <SelectItem value="10-20">10-20 hours</SelectItem>
                    <SelectItem value="20-30">20-30 hours</SelectItem>
                    <SelectItem value="30+">30+ hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="preferred-time">Preferred Working Hours</Label>
                <Select
                  value={preferredTime}
                  onValueChange={setPreferredTime}
                  required
                >
                  <SelectTrigger id="preferred-time">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning</SelectItem>
                    <SelectItem value="afternoon">Afternoon</SelectItem>
                    <SelectItem value="evening">Evening</SelectItem>
                    <SelectItem value="night">Night</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <Separator className="my-2" />
          
          <div className="space-y-4">
            <Label className="flex items-center">
              <GraduationCap className="mr-2 h-5 w-5 text-primary" />
              Education & Experience
            </Label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="education">Highest Education</Label>
                <Select
                  value={education}
                  onValueChange={setEducation}
                >
                  <SelectTrigger id="education">
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high-school">High School</SelectItem>
                    <SelectItem value="college">Some College</SelectItem>
                    <SelectItem value="bachelors">Bachelor&apos;s Degree</SelectItem>
                    <SelectItem value="masters">Master&apos;s Degree</SelectItem>
                    <SelectItem value="phd">PhD or Doctorate</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="prior-experience">Prior Data Labeling Experience</Label>
                <Select
                  value={priorExperience}
                  onValueChange={setPriorExperience}
                  required
                >
                  <SelectTrigger id="prior-experience">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="less-than-1">Less than 1 year</SelectItem>
                    <SelectItem value="1-2">1-2 years</SelectItem>
                    <SelectItem value="2-5">2-5 years</SelectItem>
                    <SelectItem value="5+">5+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="experience-description">Please describe any relevant experience</Label>
              <Textarea 
                id="experience-description" 
                placeholder="Share any experience with data labeling, AI projects, or other relevant skills..."
                className="min-h-[100px]"
                value={experienceDescription}
                onChange={(e) => setExperienceDescription(e.target.value)}
              />
            </div>
          </div>
          
          <Separator className="my-2" />
          
          <div className="space-y-4">
            <Label className="flex items-center">
              <Briefcase className="mr-2 h-5 w-5 text-primary" />
              Work Equipment
            </Label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="device-type">Primary Device</Label>
                <Select
                  value={deviceType}
                  onValueChange={setDeviceType}
                  required
                >
                  <SelectTrigger id="device-type">
                    <SelectValue placeholder="Select device" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desktop">Desktop PC</SelectItem>
                    <SelectItem value="laptop">Laptop</SelectItem>
                    <SelectItem value="tablet">Tablet</SelectItem>
                    <SelectItem value="smartphone">Smartphone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="internet-speed">Internet Connection</Label>
                <Select
                  value={internetSpeed}
                  onValueChange={setInternetSpeed}
                  required
                >
                  <SelectTrigger id="internet-speed">
                    <SelectValue placeholder="Select internet quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high-speed">High-speed (Fiber/Cable)</SelectItem>
                    <SelectItem value="moderate">Moderate (DSL/4G)</SelectItem>
                    <SelectItem value="basic">Basic (Mobile Data)</SelectItem>
                    <SelectItem value="unreliable">Unreliable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="flex items-start space-x-2 bg-muted/50 p-3 rounded-md">
            <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
            <p className="text-sm text-muted-foreground">
              All information provided will only be used to match you with suitable projects and will not be shared with third parties.
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between pt-6">
          <Button variant="outline" type="button" asChild>
            <Link href="/onboarding/labeler">
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
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
