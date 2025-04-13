"use client";
// components/labeler/labeler-profile.tsx
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
import { 
  User, 
  Wallet, 
  Languages, 
  Mail, 
  MapPin, 
  GraduationCap, 
  Clock, 
  Laptop, 
  Wifi, 
  Briefcase,
  Loader2,
  PencilLine,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  BadgeCheck,
  Shield,
  Bell
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

// Define skill category options for better UX
const SKILL_CATEGORIES = [
  { id: 'image-classification', label: 'Image Classification', description: 'Categorize images into predefined classes' },
  { id: 'object-detection', label: 'Object Detection', description: 'Draw bounding boxes around objects in images' },
  { id: 'text-annotation', label: 'Text Annotation', description: 'Label text with entities, sentiments, or other attributes' },
  { id: 'audio-transcription', label: 'Audio Transcription', description: 'Convert spoken audio to written text' },
  { id: 'data-cleaning', label: 'Data Cleaning', description: 'Identify and correct errors in datasets' },
  { id: 'sentiment-analysis', label: 'Sentiment Analysis', description: 'Analyze text for emotion or opinion' },
  { id: 'video-annotation', label: 'Video Annotation', description: 'Label objects or actions in video frames' },
  { id: 'image-segmentation', label: 'Image Segmentation', description: 'Mark exact boundaries of objects in images' },
];

export function LabelerProfile() {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    primaryLanguage: '',
    englishProficiency: '',
    skills: [] as string[],
    availableHours: '',
    preferredTime: '',
    education: '',
    experience: '',
    experienceDescription: '',
    deviceType: '',
    internetSpeed: '',
  });
  
  const { publicKey } = useWallet();
  const router = useRouter();
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!publicKey) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/labeler/profile');
        
        if (!response.ok) {
          if (response.status === 404) {
            router.push('/onboarding/labeler');
            return;
          }
          
          throw new Error(`Failed to fetch profile: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch profile');
        }
        
        setProfile(data.profile);
        
        // Initialize form data
        setFormData({
          firstName: data.profile.firstName || '',
          lastName: data.profile.lastName || '',
          email: data.profile.email || '',
          country: data.profile.country || '',
          primaryLanguage: data.profile.primaryLanguage || '',
          englishProficiency: data.profile.englishProficiency || '',
          skills: data.profile.skills || [],
          availableHours: data.profile.availableHours || '',
          preferredTime: data.profile.preferredTime || '',
          education: data.profile.education || '',
          experience: data.profile.experience || '',
          experienceDescription: data.profile.experienceDescription || '',
          deviceType: data.profile.deviceType || '',
          internetSpeed: data.profile.internetSpeed || '',
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError((error as Error).message || 'Failed to load profile. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [publicKey, router]);
  
  const handleFormChange = (field: string, value: string | string[]) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  const toggleSkill = (skillId: string) => {
    if (formData.skills.includes(skillId)) {
      handleFormChange('skills', formData.skills.filter(id => id !== skillId));
    } else {
      handleFormChange('skills', [...formData.skills, skillId]);
    }
  };
  
  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);
      
      const response = await fetch('/api/labeler/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }
      
      // Update local profile data
      setProfile(data.profile);
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError((error as Error).message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container py-12 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <Link href="/labeler/dashboard" className="text-primary flex items-center mb-2 hover:underline">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">Profile & Account</h1>
          <p className="text-muted-foreground">
            Manage your profile and account preferences
          </p>
        </div>
        
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            <PencilLine className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </div>
      
      {successMessage && (
        <div className="mb-6 bg-green-500/10 border border-green-500/20 p-4 rounded-md flex items-center">
          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
          <p>{successMessage}</p>
        </div>
      )}
      
      {error && (
        <div className="mb-6 bg-destructive/10 p-4 rounded-md border border-destructive/20 flex items-center">
          <AlertCircle className="h-5 w-5 text-destructive mr-2" />
          <p className="text-destructive">{error}</p>
        </div>
      )}
      
      <Tabs defaultValue="profile" className="mb-8">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="skills">Skills & Equipment</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Your basic information visible to project providers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isEditing ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input 
                        id="first-name" 
                        value={formData.firstName}
                        onChange={(e) => handleFormChange('firstName', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input 
                        id="last-name" 
                        value={formData.lastName}
                        onChange={(e) => handleFormChange('lastName', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => handleFormChange('email', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select 
                        value={formData.country}
                        onValueChange={(value) => handleFormChange('country', value)}
                        required
                      >
                        <SelectTrigger id="country">
                          <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="th">Thailand</SelectItem>
                          <SelectItem value="ph">Philippines</SelectItem>
                          <SelectItem value="in">India</SelectItem>
                          <SelectItem value="ng">Nigeria</SelectItem>
                          <SelectItem value="br">Brazil</SelectItem>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="language">Primary Language</Label>
                      <Select
                        value={formData.primaryLanguage}
                        onValueChange={(value) => handleFormChange('primaryLanguage', value)}
                        required
                      >
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Select primary language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="th">Thai</SelectItem>
                          <SelectItem value="hi">Hindi</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="zh">Chinese</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="english-proficiency">English Proficiency</Label>
                      <Select
                        value={formData.englishProficiency}
                        onValueChange={(value) => handleFormChange('englishProficiency', value)}
                        required
                      >
                        <SelectTrigger id="english-proficiency">
                          <SelectValue placeholder="Select proficiency level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="native">Native/Fluent</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center mb-2">
                        <User className="h-4 w-4 text-primary mr-2" />
                        <h3 className="font-medium">Name</h3>
                      </div>
                      <p>{profile.firstName} {profile.lastName}</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-2">
                        <Mail className="h-4 w-4 text-primary mr-2" />
                        <h3 className="font-medium">Email</h3>
                      </div>
                      <p>{profile.email}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center mb-2">
                        <MapPin className="h-4 w-4 text-primary mr-2" />
                        <h3 className="font-medium">Country</h3>
                      </div>
                      <p>
                        {profile.country === 'th' && 'Thailand'}
                        {profile.country === 'ph' && 'Philippines'}
                        {profile.country === 'in' && 'India'}
                        {profile.country === 'ng' && 'Nigeria'}
                        {profile.country === 'br' && 'Brazil'}
                        {profile.country === 'us' && 'United States'}
                        {profile.country === 'ca' && 'Canada'}
                        {profile.country === 'uk' && 'United Kingdom'}
                        {profile.country === 'other' && 'Other'}
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-2">
                        <Languages className="h-4 w-4 text-primary mr-2" />
                        <h3 className="font-medium">Languages</h3>
                      </div>
                      <div>
                        <p>
                          Primary: 
                          {profile.primaryLanguage === 'en' && ' English'}
                          {profile.primaryLanguage === 'th' && ' Thai'}
                          {profile.primaryLanguage === 'hi' && ' Hindi'}
                          {profile.primaryLanguage === 'es' && ' Spanish'}
                          {profile.primaryLanguage === 'fr' && ' French'}
                          {profile.primaryLanguage === 'zh' && ' Chinese'}
                          {profile.primaryLanguage === 'other' && ' Other'}
                        </p>
                        <p className="mt-1">
                          English: 
                          {profile.englishProficiency === 'native' && ' Native/Fluent'}
                          {profile.englishProficiency === 'advanced' && ' Advanced'}
                          {profile.englishProficiency === 'intermediate' && ' Intermediate'}
                          {profile.englishProficiency === 'basic' && ' Basic'}
                          {profile.englishProficiency === 'none' && ' None'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            
            {isEditing && (
              <CardFooter className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="skills" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Skills & Experience</CardTitle>
              <CardDescription>
                Your skills and experience help us match you with suitable projects
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isEditing ? (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label>Skills & Project Types</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {SKILL_CATEGORIES.map((skill) => (
                        <div 
                          key={skill.id}
                          className={`flex items-start space-x-3 p-3 rounded-md border cursor-pointer hover:bg-primary/5 transition-colors ${
                            formData.skills.includes(skill.id) ? 'border-primary bg-primary/10' : 'border-muted'
                          }`}
                          onClick={() => toggleSkill(skill.id)}
                        >
                          <input 
                            type="checkbox" 
                            checked={formData.skills.includes(skill.id)} 
                            onChange={() => toggleSkill(skill.id)}
                            className="mt-1 rounded text-primary"
                          />
                          <div>
                            <h4 className="font-medium">{skill.label}</h4>
                            <p className="text-xs text-muted-foreground">{skill.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="hours-per-week">Hours Available Per Week</Label>
                      <Select
                        value={formData.availableHours}
                        onValueChange={(value) => handleFormChange('availableHours', value)}
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
                        value={formData.preferredTime}
                        onValueChange={(value) => handleFormChange('preferredTime', value)}
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
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="education">Highest Education</Label>
                      <Select
                        value={formData.education}
                        onValueChange={(value) => handleFormChange('education', value)}
                      >
                        <SelectTrigger id="education">
                          <SelectValue placeholder="Select education level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high-school">High School</SelectItem>
                          <SelectItem value="college">Some College</SelectItem>
                          <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                          <SelectItem value="masters">Master's Degree</SelectItem>
                          <SelectItem value="phd">PhD or Doctorate</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="prior-experience">Prior Data Labeling Experience</Label>
                      <Select
                        value={formData.experience}
                        onValueChange={(value) => handleFormChange('experience', value)}
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
                    <Label htmlFor="experience-description">Relevant Experience Description</Label>
                    <Textarea 
                      id="experience-description" 
                      placeholder="Share any experience with data labeling, AI projects, or other relevant skills..."
                      className="min-h-[100px]"
                      value={formData.experienceDescription}
                      onChange={(e) => handleFormChange('experienceDescription', e.target.value)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="device-type">Primary Device</Label>
                      <Select
                        value={formData.deviceType}
                        onValueChange={(value) => handleFormChange('deviceType', value)}
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
                        value={formData.internetSpeed}
                        onValueChange={(value) => handleFormChange('internetSpeed', value)}
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
              ) : (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center mb-3">
                      <BadgeCheck className="h-4 w-4 text-primary mr-2" />
                      <h3 className="font-medium">Skills</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills && profile.skills.length > 0 ? (
                        profile.skills.map((skillId: string) => {
                          const skill = SKILL_CATEGORIES.find(s => s.id === skillId);
                          return (
                            <Badge key={skillId} variant="secondary" className="capitalize">
                              {skill ? skill.label : skillId.replace(/-/g, ' ')}
                            </Badge>
                          );
                        })
                      ) : (
                        <p className="text-muted-foreground text-sm">No skills selected yet</p>
                      )}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center mb-2">
                        <Clock className="h-4 w-4 text-primary mr-2" />
                        <h3 className="font-medium">Availability</h3>
                      </div>
                      <p>
                        {profile.availableHours && (
                          <span className="block">
                            {profile.availableHours} hours/week
                          </span>
                        )}
                        {profile.preferredTime && (
                          <span className="block mt-1 capitalize">
                            Preferred time: {profile.preferredTime}
                          </span>
                        )}
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-2">
                        <GraduationCap className="h-4 w-4 text-primary mr-2" />
                        <h3 className="font-medium">Education & Experience</h3>
                      </div>
                      <p>
                        {profile.education && (
                          <span className="block">
                            {profile.education === 'high-school' && 'High School'}
                            {profile.education === 'college' && 'Some College'}
                            {profile.education === 'bachelors' && "Bachelor's Degree"}
                            {profile.education === 'masters' && "Master's Degree"}
                            {profile.education === 'phd' && 'PhD or Doctorate'}
                            {profile.education === 'other' && 'Other'}
                          </span>
                        )}
                        {profile.experience && (
                          <span className="block mt-1">
                            {profile.experience === 'none' && 'No prior labeling experience'}
                            {profile.experience === 'less-than-1' && 'Less than 1 year experience'}
                            {profile.experience === '1-2' && '1-2 years experience'}
                            {profile.experience === '2-5' && '2-5 years experience'}
                            {profile.experience === '5+' && '5+ years experience'}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  {profile.experienceDescription && (
                    <>
                      <Separator />
                      
                      <div>
                        <div className="flex items-center mb-2">
                          <Briefcase className="h-4 w-4 text-primary mr-2" />
                          <h3 className="font-medium">Experience Details</h3>
                        </div>
                        <p className="text-muted-foreground">{profile.experienceDescription}</p>
                      </div>
                    </>
                  )}
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center mb-2">
                        <Laptop className="h-4 w-4 text-primary mr-2" />
                        <h3 className="font-medium">Device</h3>
                      </div>
                      <p className="capitalize">
                        {profile.deviceType || 'Not specified'}
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-2">
                        <Wifi className="h-4 w-4 text-primary mr-2" />
                        <h3 className="font-medium">Internet Connection</h3>
                      </div>
                      <p>
                        {profile.internetSpeed === 'high-speed' && 'High-speed (Fiber/Cable)'}
                        {profile.internetSpeed === 'moderate' && 'Moderate (DSL/4G)'}
                        {profile.internetSpeed === 'basic' && 'Basic (Mobile Data)'}
                        {profile.internetSpeed === 'unreliable' && 'Unreliable'}
                        {!profile.internetSpeed && 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            
            {isEditing && (
              <CardFooter className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="account" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Manage your wallet and account settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center mb-2">
                  <Wallet className="h-4 w-4 text-primary mr-2" />
                  <h3 className="font-medium">Connected Wallet</h3>
                </div>
                <div className="flex items-center">
                  <Badge variant="outline" className="font-mono">
                    {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  This is the wallet where you'll receive payments for completed tasks.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <div className="flex items-center mb-2">
                  <Shield className="h-4 w-4 text-primary mr-2" />
                  <h3 className="font-medium">Account Status</h3>
                </div>
                <div className="flex items-center">
                  <Badge className="bg-green-500">Active</Badge>
                  {profile.rating && profile.rating >= 4.5 && (
                    <Badge variant="outline" className="ml-2 flex items-center">
                      <BadgeCheck className="h-3 w-3 mr-1" />
                      Trusted Labeler
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Your account is in good standing and eligible for all project types.
                </p>
                {profile.stats?.completedTasks > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    You've completed {profile.stats.completedTasks} tasks with a rating of {profile.rating?.toFixed(1) || 'N/A'}/5.0
                  </p>
                )}
              </div>
              
              <Separator />
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Bell className="h-4 w-4 text-primary mr-2" />
                    <h3 className="font-medium">Notifications</h3>
                  </div>
                  <Switch checked={true} />
                </div>
                <p className="text-xs text-muted-foreground">
                  Receive notifications about new projects, payments, and important updates.
                </p>
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-primary mr-2" />
                  <h3 className="font-medium">Email Notifications</h3>
                </div>
                <Switch checked={true} />
              </div>
              <p className="text-xs text-muted-foreground">
                Receive email notifications about new projects and payments.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
