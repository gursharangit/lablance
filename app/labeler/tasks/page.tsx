
// app/labeler/tasks/page.tsx
"use client";

import { TaskInterface } from "@/components/labeling/task-interface";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { Loader2 } from "lucide-react";

export default function TasksPage() {
  const [isChecking, setIsChecking] = useState(true);
  const { publicKey } = useWallet();
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  useEffect(() => {
    const checkRegistration = async () => {
      // Verify project ID is provided
      if (!projectId) {
        router.push("/labeler/dashboard");
        return;
      }

      // Skip check if wallet not connected
      if (!publicKey) {
        setIsChecking(false);
        return;
      }

      try {
        // Check if labeler exists for this wallet
        const response = await fetch(`/api/labeler/profile`);
        
        if (!response.ok && response.status === 404) {
          // Not registered, redirect to registration
          router.push("/onboarding/labeler");
          return;
        }
        
        // If we get here, user is registered
        setIsChecking(false);
      } catch (error) {
        console.error("Error checking labeler registration:", error);
        setIsChecking(false);
      }
    };

    checkRegistration();
  }, [publicKey, router, projectId]);

  if (isChecking) {
    return (
      <div className="container py-20 flex justify-center items-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Preparing your tasks...</p>
        </div>
      </div>
    );
  }

  return <TaskInterface />;
}
