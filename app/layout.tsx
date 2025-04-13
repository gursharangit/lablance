import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./wallet-adapter.css"; // Import wallet adapter custom styles
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/navbar";
import { ThemeProvider } from "@/components/layout/theme-provider";
import dynamic from 'next/dynamic';

// Dynamically import the WalletProviderWrapper with no SSR
// This ensures it only runs on the client side
const WalletProviderWrapper = dynamic(
  () => import('@/components/solana/wallet-provider-wrapper'),
  {
    ssr: false,
  }
);

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Data Labeling Platform",
  description: "Connect global talent with AI training needs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background", inter.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Client-side only component for wallet provider */}
          <WalletProviderWrapper>
            <Navbar />
            {children}
          </WalletProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}