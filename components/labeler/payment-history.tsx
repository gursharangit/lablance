"use client";
// components/labeler/payment-history.tsx
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
  CircleDollarSign,
  Loader2,
  ArrowLeft,
  ArrowUpRight,
  Download,
  CreditCard,
  Calendar,
  BarChart,
  BadgeCheck,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Mock payment data (in a real app, this would come from the API)
const MOCK_PAYMENTS = [
  {
    id: 'tx-1',
    date: new Date(2025, 3, 10, 14, 25),
    amount: 2.40,
    projectId: 'proj-123',
    projectName: 'Object Detection - Vehicles',
    tasksCompleted: 24,
    status: 'completed',
    transactionSignature: '5UxV7...7kYrX'
  },
  {
    id: 'tx-2',
    date: new Date(2025, 3, 9, 18, 12),
    amount: 1.60,
    projectId: 'proj-456',
    projectName: 'Text Annotation - Medical Records',
    tasksCompleted: 16,
    status: 'completed',
    transactionSignature: '4JnT8...9pQzW'
  },
  {
    id: 'tx-3',
    date: new Date(2025, 3, 8, 11, 33),
    amount: 3.80,
    projectId: 'proj-789',
    projectName: 'Image Classification - Street Signs',
    tasksCompleted: 38,
    status: 'completed',
    transactionSignature: '7KvR2...3mBnP'
  },
  {
    id: 'tx-4',
    date: new Date(2025, 3, 7, 15, 45),
    amount: 2.20,
    projectId: 'proj-123',
    projectName: 'Object Detection - Vehicles',
    tasksCompleted: 22,
    status: 'completed',
    transactionSignature: '9LsY6...2zXcQ'
  },
  {
    id: 'tx-5',
    date: new Date(2025, 3, 6, 9, 19),
    amount: 3.00,
    projectId: 'proj-456',
    projectName: 'Text Annotation - Medical Records',
    tasksCompleted: 30,
    status: 'completed',
    transactionSignature: '2FwP5...6qVrT'
  },
  {
    id: 'tx-6',
    date: new Date(2025, 3, 5, 12, 51),
    amount: 1.80,
    projectId: 'proj-789',
    projectName: 'Image Classification - Street Signs',
    tasksCompleted: 18,
    status: 'completed',
    transactionSignature: '8DtZ4...1nGsJ'
  },
  {
    id: 'tx-7',
    date: new Date(2025, 3, 4, 17, 22),
    amount: 2.90,
    projectId: 'proj-123',
    projectName: 'Object Detection - Vehicles',
    tasksCompleted: 29,
    status: 'completed',
    transactionSignature: '3CrB7...5kLpH'
  },
  {
    id: 'tx-8',
    date: new Date(2025, 3, 3, 10, 14),
    amount: 1.30,
    projectId: 'proj-456',
    projectName: 'Text Annotation - Medical Records',
    tasksCompleted: 13,
    status: 'completed',
    transactionSignature: '6GvN9...0mDfU'
  }
];

// Create week-over-week earnings data
const MOCK_WEEKLY_EARNINGS = [
  { week: 'Week 1', amount: 12.60 },
  { week: 'Week 2', amount: 15.80 },
  { week: 'Week 3', amount: 19.40 },
  { week: 'Week 4', amount: 14.70 },
  { week: 'Current', amount: 16.90 }
];

export function PaymentHistory() {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [weeklyEarnings, setWeeklyEarnings] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const itemsPerPage = 5;
  const { publicKey } = useWallet();
  const router = useRouter();
  
  useEffect(() => {
    const fetchPaymentHistory = async () => {
      // In a real app, you would fetch data from the API
      // For this demo, we'll use the mock data
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For a real app, you would make a fetch request to your API
        // const response = await fetch('/api/labeler/payments');
        // const data = await response.json();
        
        // Set the mock data
        setPayments(MOCK_PAYMENTS);
        setWeeklyEarnings(MOCK_WEEKLY_EARNINGS);
        
        // Get profile data (in a real app)
        const profileResponse = await fetch('/api/labeler/profile');
        
        if (!profileResponse.ok) {
          if (profileResponse.status === 404) {
            router.push('/onboarding/labeler');
            return;
          }
          
          throw new Error(`Failed to fetch profile: ${profileResponse.statusText}`);
        }
        
        const profileData = await profileResponse.json();
        setProfile(profileData.profile);
      } catch (error) {
        console.error('Error fetching payment history:', error);
        setError((error as Error).message || 'Failed to load payment history. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPaymentHistory();
  }, [router]);
  
  // Filter payments based on selected filters
  const filteredPayments = payments.filter(payment => {
    // Filter by project
    if (projectFilter !== 'all' && payment.projectId !== projectFilter) {
      return false;
    }
    
    // Filter by time
    if (timeFilter !== 'all') {
      const now = new Date();
      const paymentDate = new Date(payment.date);
      
      if (timeFilter === 'today') {
        return paymentDate.toDateString() === now.toDateString();
      } else if (timeFilter === 'this-week') {
        const oneWeekAgo = new Date(now);
        oneWeekAgo.setDate(now.getDate() - 7);
        return paymentDate >= oneWeekAgo;
      } else if (timeFilter === 'this-month') {
        return paymentDate.getMonth() === now.getMonth() && 
               paymentDate.getFullYear() === now.getFullYear();
      }
    }
    
    return true;
  });
  
  // Paginate filtered payments
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Calculate totals for dashboard stats
  const totalEarnings = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalTasks = payments.reduce((sum, payment) => sum + payment.tasksCompleted, 0);
  const averagePerTask = totalTasks > 0 ? totalEarnings / totalTasks : 0;
  
  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get Solana explorer URL for a transaction
  const getExplorerUrl = (signature: string) => {
    // Use mainnet-beta for production, devnet for testing
    const cluster = 'devnet'; // Change to mainnet-beta for production
    return `https://explorer.solana.com/tx/${signature}?cluster=${cluster}`;
  };
  
  if (isLoading) {
    return (
      <div className="container py-12 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading payment history...</p>
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
            <Button asChild>
              <Link href="/labeler/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Dashboard
              </Link>
            </Button>
          </CardFooter>
        </Card>
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
          <h1 className="text-3xl font-bold">Payment History</h1>
          <p className="text-muted-foreground">
            Track your earnings and payment transactions
          </p>
        </div>
        
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-muted-foreground">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="mr-4 rounded-full bg-primary/10 p-2">
                <CircleDollarSign className="h-8 w-8 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">${totalEarnings.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">
                  From {payments.length} payments
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-muted-foreground">Tasks Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="mr-4 rounded-full bg-primary/10 p-2">
                <BadgeCheck className="h-8 w-8 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalTasks}</div>
                <div className="text-xs text-muted-foreground">
                  Avg. ${averagePerTask.toFixed(2)} per task
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-muted-foreground">Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="mr-4 rounded-full bg-primary/10 p-2">
                <CreditCard className="h-8 w-8 text-primary" />
              </div>
              <div>
                <div className="text-lg font-medium">Solana Wallet</div>
                <div className="text-xs text-muted-foreground">
                  {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Transactions</CardTitle>
              <div className="flex items-center space-x-2">
                <Select
                  value={projectFilter}
                  onValueChange={setProjectFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    <SelectItem value="proj-123">Object Detection</SelectItem>
                    <SelectItem value="proj-456">Text Annotation</SelectItem>
                    <SelectItem value="proj-789">Image Classification</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select
                  value={timeFilter}
                  onValueChange={setTimeFilter}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="this-week">This Week</SelectItem>
                    <SelectItem value="this-month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {paginatedPayments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No payments found with the selected filters.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Tasks</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Transaction</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{formatDate(payment.date)}</TableCell>
                      <TableCell>{payment.projectName}</TableCell>
                      <TableCell>{payment.tasksCompleted}</TableCell>
                      <TableCell className="text-right">${payment.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <a
                          href={getExplorerUrl(payment.transactionSignature)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline inline-flex items-center"
                        >
                          View
                          <ArrowUpRight className="ml-1 h-3 w-3" />
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            
            {totalPages > 1 && (
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) setCurrentPage(currentPage - 1);
                        }}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }).map((_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(index + 1);
                          }}
                          isActive={currentPage === index + 1}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                        }}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Weekly Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex flex-col justify-end">
              <div className="grid grid-cols-5 gap-2 h-64">
                {weeklyEarnings.map((week, index) => {
                  // Calculate height percentage (max is 80% of container)
                  const maxEarnings = Math.max(...weeklyEarnings.map(w => w.amount));
                  const heightPercentage = (week.amount / maxEarnings) * 80;
                  
                  return (
                    <div key={index} className="flex flex-col items-center justify-end">
                      <div 
                        className={`w-full bg-primary rounded-t-md ${index === weeklyEarnings.length - 1 ? 'bg-primary/80' : ''}`}
                        style={{ height: `${heightPercentage}%` }}
                      ></div>
                      <div className="mt-2 text-xs font-medium">{week.week}</div>
                      <div className="text-xs text-muted-foreground">${week.amount.toFixed(2)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Payment FAQs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-1">How are payments calculated?</h3>
            <p className="text-sm text-muted-foreground">
              Payments are calculated based on the number of tasks you complete. Each project has a fixed rate per task, typically $0.10 per task.
            </p>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-medium mb-1">When are payments processed?</h3>
            <p className="text-sm text-muted-foreground">
              Payments are processed instantly when you submit completed tasks. The USDC tokens are transferred directly to your connected Solana wallet.
            </p>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-medium mb-1">Are there any fees?</h3>
            <p className="text-sm text-muted-foreground">
              No, we don&apos;t charge any fees for payments. The only fees involved are the standard Solana transaction fees, which are minimal (typically less than $0.001).
            </p>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-medium mb-1">How can I withdraw my USDC?</h3>
            <p className="text-sm text-muted-foreground">
              Your USDC is sent directly to your Solana wallet. You can use any Solana exchange or swap service to convert it to your local currency or other cryptocurrencies.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}