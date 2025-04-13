import { Separator } from "@/components/ui/separator";
import { ChevronsDownIcon, Github, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const FooterSection = () => {
  return (
    <footer id="footer" className="container py-20 sm:py-32">
      <div className="p-8 sm:p-10 bg-card border border-muted rounded-2xl">
        {/* Newsletter Section */}
        <div className="mb-12 pb-12 border-b border-muted">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
              <p className="text-muted-foreground mb-2">
                Subscribe to our newsletter for the latest updates on our platform,
                new features, and AI data labeling best practices.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
              <div className="flex-1">
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="h-12" 
                />
              </div>
              <Button className="shrink-0">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex font-bold items-center mb-6">
              <ChevronsDownIcon className="w-9 h-9 mr-2 bg-gradient-to-tr from-primary via-primary/70 to-primary rounded-lg border border-muted" />
              <h3 className="text-2xl">AI Labeling</h3>
            </Link>
            
            <p className="text-muted-foreground mb-4">
              Connecting global talent with AI training needs through secure, 
              blockchain-powered data labeling.
            </p>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <a 
                  href="mailto:gurusharanworks1@gmail.com" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  gurusharanworks1@gmail.com
                </a>
              </div>
              <div className="flex items-center">
                <Github className="h-4 w-4 mr-2 text-muted-foreground" />
                <a 
                  href="https://github.com/gursharangit" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  github.com/gursharangit
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg mb-3">Platform</h3>
            <Link href="#features" className="text-muted-foreground hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#benefits" className="text-muted-foreground hover:text-primary transition-colors">
              Benefits
            </Link>
            <Link href="#services" className="text-muted-foreground hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link href="#faq" className="text-muted-foreground hover:text-primary transition-colors">
              FAQ
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg mb-3">Company</h3>
            <Link href="#team" className="text-muted-foreground hover:text-primary transition-colors">
              About Us
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Careers
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Blog
            </Link>
            <Link href="mailto:gurusharanworks1@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg mb-3">Resources</h3>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Documentation
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Tutorials
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              API Reference
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>

        <Separator className="my-8" />
        
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} AI Data Labeling Platform. All rights reserved.
          </p>
          
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <Link 
              href="https://github.com/gursharangit" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link 
              href="#" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.46 6C21.69 6.35 20.86 6.58 20 6.69C20.88 6.16 21.56 5.32 21.88 4.31C21.05 4.81 20.13 5.16 19.16 5.36C18.37 4.5 17.26 4 16 4C13.65 4 11.73 5.92 11.73 8.29C11.73 8.63 11.77 8.96 11.84 9.27C8.28 9.09 5.11 7.38 3 4.79C2.63 5.42 2.42 6.16 2.42 6.94C2.42 8.43 3.17 9.75 4.33 10.5C3.62 10.5 2.96 10.3 2.38 10V10.03C2.38 12.11 3.86 13.85 5.82 14.24C5.19 14.41 4.52 14.44 3.88 14.31C4.16 15.14 4.69 15.86 5.39 16.38C6.09 16.9 6.93 17.18 7.79 17.17C6.25 18.3 4.45 19 2.62 19C2.28 19 1.94 18.98 1.6 18.94C3.45 20.16 5.66 20.84 8 20.84C16 20.84 20.33 14.25 20.33 8.53C20.33 8.33 20.33 8.13 20.32 7.94C21.17 7.33 21.88 6.56 22.46 5.66V6Z" fill="currentColor"/>
              </svg>
              <span className="sr-only">Twitter</span>
            </Link>
            <Link 
              href="#" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 3H4C3.73478 3 3.48043 3.10536 3.29289 3.29289C3.10536 3.48043 3 3.73478 3 4V20C3 20.2652 3.10536 20.5196 3.29289 20.7071C3.48043 20.8946 3.73478 21 4 21H12V14H10V12H12V10C12 8.97 12.42 8.1 13.05 7.55C13.68 7 14.45 6.7 15.3 6.7C15.81 6.7 16.27 6.73 16.67 6.78C17.07 6.83 17.35 6.87 17.5 6.9V8.8H16.25C15.71 8.8 15.33 8.93 15.1 9.2C14.97 9.37 14.9 9.59 14.9 9.9V12H17.4L17.1 14H14.9V21H20C20.2652 21 20.5196 20.8946 20.7071 20.7071C20.8946 20.5196 21 20.2652 21 20V4C21 3.73478 20.8946 3.48043 20.7071 3.29289C20.5196 3.10536 20.2652 3 20 3Z" fill="currentColor"/>
              </svg>
              <span className="sr-only">Facebook</span>
            </Link>
            <Link 
              href="#" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V18C22 18.5304 21.7893 19.0391 21.4142 19.4142C21.0391 19.7893 20.5304 20 20 20H14C12.4087 20 10.8826 19.3679 9.75736 18.2426C8.63214 17.1174 8 15.5913 8 14C8 12.4087 8.63214 10.8826 9.75736 9.75736C10.8826 8.63214 12.4087 8 14 8H16ZM16 10H14C12.9391 10 11.9217 10.4214 11.1716 11.1716C10.4214 11.9217 10 12.9391 10 14C10 15.0609 10.4214 16.0783 11.1716 16.8284C11.9217 17.5786 12.9391 18 14 18H16V14C16 13.4696 16.2107 12.9609 16.5858 12.5858C16.9609 12.2107 17.4696 12 18 12H20V14C20 14.7956 19.6839 15.5587 19.1213 16.1213C18.5587 16.6839 17.7956 17 17 17H16V16C16 15.4696 15.7893 14.9609 15.4142 14.5858C15.0391 14.2107 14.5304 14 14 14C13.4696 14 12.9609 14.2107 12.5858 14.5858C12.2107 14.9609 12 15.4696 12 16C12 16.5304 12.2107 17.0391 12.5858 17.4142C12.9609 17.7893 13.4696 18 14 18" fill="currentColor"/>
                <path d="M4 4H9C9.53043 4 10.0391 4.21071 10.4142 4.58579C10.7893 4.96086 11 5.46957 11 6V9C11 9.53043 10.7893 10.0391 10.4142 10.4142C10.0391 10.7893 9.53043 11 9 11H4C3.46957 11 2.96086 10.7893 2.58579 10.4142C2.21071 10.0391 2 9.53043 2 9V6C2 5.46957 2.21071 4.96086 2.58579 4.58579C2.96086 4.21071 3.46957 4 4 4ZM4 13H9C9.53043 13 10.0391 13.2107 10.4142 13.5858C10.7893 13.9609 11 14.4696 11 15V18C11 18.5304 10.7893 19.0391 10.4142 19.4142C10.0391 19.7893 9.53043 20 9 20H4C3.46957 20 2.96086 19.7893 2.58579 19.4142C2.21071 19.0391 2 18.5304 2 18V15C2 14.4696 2.21071 13.9609 2.58579 13.5858C2.96086 13.2107 3.46957 13 4 13Z" fill="currentColor"/>
              </svg>
              <span className="sr-only">LinkedIn</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};