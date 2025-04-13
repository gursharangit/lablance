"use client";
// components/dashboard/labeler-dashboard.tsx
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
  Clock,
  Download,
  FileCheck,
  Loader2,
  Info,
  SearchCheck,
  BarChart3,
  Wallet,
  Filter,
  Tag,
  ArrowRight,
  BadgeCheck,
  CircleDollarSign,
  CheckCircle2,
  ImageIcon,
  FileText,
  MicIcon,
  TagsIcon,
  Brush,
  MessageSquare
} from "lucide-react";
import { WalletConnectButton } from "@/components/solana/wallet-connect-button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Utility function to get project type icon
const getProjectTypeIcon = (type: string) => {
  switch (type) {
    case 'image-classification':
      return <ImageIcon className="h-4 w-4" />;
    case 'object-detection':
      return <TagsIcon className="h-4 w-4" />;
    case 'text-annotation':
      return <FileText className="h-4 w-4" />;
    case 'audio-transcription':
      return <MicIcon className="h-4 w-4" />;
    case 'data-cleaning':
      return <Brush className="h-4 w-4" />;
    case 'sentiment-analysis':
      return <MessageSquare className="h-4 w-4" />;
    default:
      return <TagsIcon className="h-4 w-4" />;
  }
};

// Project card component for available projects
const AvailableProjectCard = ({ project, onSelect }: { project: any; onSelect: () => void }) => {
  return (
    <Card className="border-l-4 border-l-blue-500 h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="flex items-center space-x-1">
                {getProjectTypeIcon(project.type)}
                <span className="capitalize">{project.type.replace(/-/g, ' ')}</span>
              </Badge>
              <Badge variant="secondary">${(0.10).toFixed(2)} per task</Badge>
            </div>
            <CardTitle className="mt-2">{project.name}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-2 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{project.description}</p>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Items:</span>
            <span className="ml-1 font-medium">{project.estimatedItems}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Quality:</span>
            <span className="ml-1 font-medium capitalize">{project.qualityRequirement}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          size="sm"
          className="w-full"
          onClick={onSelect}
        >
          Start Labeling
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
};

// Project card component for in-progress projects
const ActiveProjectCard = ({ project, onContinue }: { project: any; onContinue: () => void }) => {
  // Calculate completion percentage
  const completionPercentage = Math.round((project.tasksCompleted / project.tasksTotal) * 100);

  return (
    <Card className="border-l-4 border-l-primary h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="flex items-center space-x-1">
                {getProjectTypeIcon(project.project.type)}
                <span className="capitalize">{project.project.type.replace(/-/g, ' ')}</span>
              </Badge>
              <Badge>${project.earnings.toFixed(2)} earned</Badge>
            </div>
            <CardTitle className="mt-2">{project.project.name}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-2 flex-grow">
        <div className="space-y-2 mt-1 mb-3">
          <div className="flex justify-between text-xs">
            <span>{project.tasksCompleted} of {project.tasksTotal} tasks</span>
            <span>{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Earnings:</span>
            <span className="ml-1 font-medium">${project.earnings.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Rate:</span>
            <span className="ml-1 font-medium">${(0.10).toFixed(2)}/task</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          size="sm"
          className="w-full"
          onClick={onContinue}
        >
          Continue Labeling
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export function LabelerDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [availableProjects, setAvailableProjects] = useState<any[]>([]);
  const [activeProjects, setActiveProjects] = useState<any[]>([]);
  const [projectTypeFilter, setProjectTypeFilter] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);
  const { publicKey, connected } = useWallet();
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!publicKey || !connected) return;

      try {
        setIsLoading(true);
        setError(null);

        // Fetch profile data
        const profileResponse = await fetch('/api/labeler/profile');

        if (!profileResponse.ok) {
          if (profileResponse.status === 404) {
            // No profile found, redirect to registration
            router.push('/onboarding/labeler');
            return;
          }

          throw new Error(`Failed to fetch profile: ${profileResponse.statusText}`);
        }

        const profileData = await profileResponse.json();
        setProfile(profileData.profile);

        // Fetch projects data
        const projectsResponse = await fetch('/api/labeler/projects');

        if (!projectsResponse.ok) {
          throw new Error(`Failed to fetch projects: ${projectsResponse.statusText}`);
        }

        const projectsData = await projectsResponse.json();
        setAvailableProjects(projectsData.availableProjects || []);
        setActiveProjects(projectsData.activeProjects || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [publicKey, connected, router]);

  const handleSelectProject = (projectId: string) => {
    router.push(`/labeler/tasks?projectId=${projectId}`);
  };

  const handleContinueProject = (projectId: string) => {
    router.push(`/labeler/tasks?projectId=${projectId}`);
  };

  const filteredProjects = projectTypeFilter === 'all'
    ? availableProjects
    : availableProjects.filter(project => project.type === projectTypeFilter);

  if (!publicKey) {
    return (
      <div className="container py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Connect Wallet</CardTitle>
            <CardDescription>
              Please connect your Solana wallet to access your labeler dashboard
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
              <Info className="h-6 w-6 text-destructive" />
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
      <div className="mt-[30px] flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold"> Labeler Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.firstName} {profile?.lastName}
          </p>
        </div>

        <Button asChild>
          <Link href="/labeler/profile">
            <BadgeCheck className="mr-2 h-4 w-4" />
            View Profile
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-muted-foreground">Tasks Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="mr-4 rounded-full bg-primary/10 p-2">
                <FileCheck className="h-8 w-8 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{profile?.stats?.completedTasks || 0}</div>
                <div className="text-xs text-muted-foreground">
                  Tasks across {profile?.stats?.projectCount || 0} projects
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-muted-foreground">Total Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="mr-4 rounded-full bg-primary/10 p-2">
                <CircleDollarSign className="h-8 w-8 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">${(profile?.stats?.totalEarned || 0).toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">
                  USDC paid directly to your wallet
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-muted-foreground">Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="mr-4 rounded-full bg-primary/10 p-2">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{profile?.rating ? `${profile.rating.toFixed(1)}/5.0` : 'N/A'}</div>
                <div className="text-xs text-muted-foreground">
                  {profile?.rating >= 4.5 ? 'Excellent' : profile?.rating >= 4.0 ? 'Very Good' : profile?.rating >= 3.5 ? 'Good' : 'Not enough data'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="available" className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="available">Available Projects</TabsTrigger>
            <TabsTrigger value="active">My Projects</TabsTrigger>
          </TabsList>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={projectTypeFilter}
                onValueChange={setProjectTypeFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Project Types</SelectItem>
                  <SelectItem value="image-classification">Image Classification</SelectItem>
                  <SelectItem value="object-detection">Object Detection</SelectItem>
                  <SelectItem value="text-annotation">Text Annotation</SelectItem>
                  <SelectItem value="audio-transcription">Audio Transcription</SelectItem>
                  <SelectItem value="data-cleaning">Data Cleaning</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <TabsContent value="available" className="mt-4">
          {filteredProjects.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <SearchCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No available projects</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  {projectTypeFilter === 'all'
                    ? "There are no available projects at the moment. Please check back later."
                    : `There are no available ${projectTypeFilter.replace(/-/g, ' ')} projects at the moment. Try selecting a different project type.`
                  }
                </p>
                {projectTypeFilter !== 'all' && (
                  <Button
                    variant="outline"
                    onClick={() => setProjectTypeFilter('all')}
                  >
                    Show All Project Types
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((project) => (
                <AvailableProjectCard
                  key={project.id}
                  project={project}
                  onSelect={() => handleSelectProject(project.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="active" className="mt-4">
          {activeProjects.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <Brush className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No active projects</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  You haven't started working on any projects yet. Browse available projects to get started.
                </p>
                <Button
                  onClick={() => {
                    const element = document.querySelector('[data-value="available"]');
                    if (element instanceof HTMLElement) {
                      element.click();
                    }
                  }}
                >
                  Browse Available Projects
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeProjects.map((project) => (
                <ActiveProjectCard
                  key={project.project.id}
                  project={project}
                  onContinue={() => handleContinueProject(project.project.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Card className="border-primary/20 bg-primary/5 mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Info className="mr-2 h-5 w-5" />
            Tips for Successful Labeling
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card p-4 rounded-md border border-muted">
              <div className="flex items-center mb-2">
                <BadgeCheck className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-medium">Quality Matters</h3>
              </div>
              <p className="text-sm text-muted-foreground">Focus on accuracy rather than speed. Higher quality work leads to better ratings and more project opportunities.</p>
            </div>

            <div className="bg-card p-4 rounded-md border border-muted">
              <div className="flex items-center mb-2">
                <Clock className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-medium">Work Consistently</h3>
              </div>
              <p className="text-sm text-muted-foreground">Regular work helps build your reputation. Even 30 minutes daily can significantly increase your earnings over time.</p>
            </div>

            <div className="bg-card p-4 rounded-md border border-muted">
              <div className="flex items-center mb-2">
                <Tag className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-medium">Read Instructions Carefully</h3>
              </div>
              <p className="text-sm text-muted-foreground">Each project has specific requirements. Take time to understand the instructions before starting to work.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}