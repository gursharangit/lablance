// app/company/dashboard/page.tsx
import { Metadata } from "next";
import { CompanyDashboard } from "@/components/dashboard/company-dashboard";

export const metadata: Metadata = {
  title: "Company Dashboard - AI Data Labeling Platform",
  description: "Monitor your data labeling projects in real-time",
};

export default function DashboardPage() {
  return <CompanyDashboard />;
}