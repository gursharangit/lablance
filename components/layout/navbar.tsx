"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "../ui/button";
import { ToggleTheme } from "./toogle-theme";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "../ui/sheet";
import { Separator } from "../ui/separator";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Only render on home page
  if (pathname !== "/") {
    return null;
  }

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Check if route is active
  const isActive = (href: string) => {
    if (href.startsWith("/#")) {
      return pathname === "/" && window.location.hash === href.substring(1);
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full">
      <div className="mx-auto px-4 py-2 max-w-7xl bg-[#1A1A1A] rounded-b-xl border border-[#333333] border-t-0">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="bg-[#FF4800] w-8 h-8 rounded flex items-center justify-center mr-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 9L12 16L5 9"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="font-bold text-xl text-white">Lablance</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <div className="relative group">
              <button className="text-white hover:text-[#FF4800] flex items-center gap-1 transition-colors">
                Features
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="transition-transform group-hover:rotate-180"
                >
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <div className="absolute left-0 top-full mt-2 w-64 bg-[#252525] rounded-lg border border-[#333333] shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="p-4">
                  <div className="mb-2 pb-2 border-b border-[#333333]">
                    <h3 className="text-[#FF4800] font-medium">AI Data Labeling</h3>
                  </div>
                  <ul className="space-y-2">
                    <li>
                      <Link href="/#benefits" className="text-white hover:text-[#FF4800] text-sm">
                        Global Workforce
                      </Link>
                    </li>
                    <li>
                      <Link href="/#features" className="text-white hover:text-[#FF4800] text-sm">
                        Blockchain Payments
                      </Link>
                    </li>
                    <li>
                      <Link href="/#services" className="text-white hover:text-[#FF4800] text-sm">
                        Quality Assurance
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <Link
              href="/#benefits"
              className={`text-white hover:text-[#FF4800] transition-colors ${
                isActive("/#benefits") ? "text-[#FF4800]" : ""
              }`}
            >
              Benefits
            </Link>
            <Link
              href="/#features"
              className={`text-white hover:text-[#FF4800] transition-colors ${
                isActive("/#features") ? "text-[#FF4800]" : ""
              }`}
            >
              Features
            </Link>
            <Link
              href="/#services"
              className={`text-white hover:text-[#FF4800] transition-colors ${
                isActive("/#services") ? "text-[#FF4800]" : ""
              }`}
            >
              Pricing
            </Link>
            <Link
              href="/#faq"
              className={`text-white hover:text-[#FF4800] transition-colors ${
                isActive("/#faq") ? "text-[#FF4800]" : ""
              }`}
            >
              FAQ
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <div className="hidden md:block">
              <ToggleTheme />
            </div>

            {/* Get Started Button */}
            <div className="hidden md:block">
              <Button 
                asChild 
                className="bg-[#FF4800] hover:bg-[#FF4800]/90 text-white border-none"
              >
                <Link href="/onboarding">
                  Get Started
                </Link>
              </Button>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent 
                  side="right" 
                  className="bg-[#1A1A1A] border-[#333333] text-white"
                >
                  <SheetHeader className="mb-6">
                    <SheetTitle className="text-white flex items-center">
                      <div className="bg-[#FF4800] w-8 h-8 rounded flex items-center justify-center mr-2">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M19 9L12 16L5 9"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span className="font-bold text-xl text-white">Lablance</span>
                    </SheetTitle>
                  </SheetHeader>
                  
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h3 className="text-[#FF4800] font-medium mb-2">Navigation</h3>
                      <div className="flex flex-col space-y-3">
                        <Link
                          href="/#benefits"
                          className="text-white hover:text-[#FF4800] transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          Benefits
                        </Link>
                        <Link
                          href="/#features"
                          className="text-white hover:text-[#FF4800] transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          Features
                        </Link>
                        <Link
                          href="/#services"
                          className="text-white hover:text-[#FF4800] transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          Pricing
                        </Link>
                        <Link
                          href="/#faq"
                          className="text-white hover:text-[#FF4800] transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          FAQ
                        </Link>
                      </div>
                    </div>
                    
                    <Separator className="bg-[#333333]" />
                    
                    <div className="space-y-3">
                      <h3 className="text-[#FF4800] font-medium mb-2">Account</h3>
                      <Button 
                        asChild 
                        className="w-full bg-[#FF4800] hover:bg-[#FF4800]/90 text-white"
                      >
                        <Link href="/onboarding" onClick={() => setIsOpen(false)}>
                          Get Started
                        </Link>
                      </Button>
                    </div>
                    
                    <Separator className="bg-[#333333]" />
                    
                    <div className="pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">Theme</span>
                        <ToggleTheme />
                      </div>
                    </div>
                  </div>
                  
                  <SheetFooter className="absolute bottom-4 left-4 right-4">
                    <div className="pt-4 border-t border-[#333333] text-center">
                      <div className="text-xs text-[#666666]">
                        © 2025 Lablance. All rights reserved.
                      </div>
                    </div>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}