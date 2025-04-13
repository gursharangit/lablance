import GithubIcon from "@/components/icons/github-icon";
import LinkedInIcon from "@/components/icons/linkedin-icon";
import XIcon from "@/components/icons/x-icon";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface TeamProps {
  imageUrl: string;
  firstName: string;
  lastName: string;
  position: string;
  bio: string;
  socialNetworks: SocialNetworkProps[];
}

interface SocialNetworkProps {
  name: string;
  url: string;
}

export const TeamSection = () => {
  const teamList: TeamProps[] = [
    {
      imageUrl: "https://github.com/gursharangit.png",
      firstName: "Gursharan",
      lastName: "",
      position: "Founder & Lead Developer",
      bio: "Passionate about blockchain technology and AI, with expertise in building decentralized applications.",
      socialNetworks: [
        {
          name: "Github",
          url: "https://github.com/gursharangit",
        },
        {
          name: "X",
          url: "https://twitter.com/0xgursharan",
        },
      ],
    },
  ];

  const socialIcon = (socialName: string) => {
    switch (socialName) {
      case "Github":
        return <GithubIcon />;
      case "X":
        return <XIcon />;
      case "LinkedIn":
        return <LinkedInIcon />;
      default:
        return null;
    }
  };

  return (
    <section id="team" className="container py-24 sm:py-32 relative">
      <div className="absolute -z-10 left-0 bottom-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-70"></div>

      <div className="text-center mb-12">
        <h2 className="text-lg text-primary mb-2 tracking-wider font-medium">
          Project Creator
        </h2>

        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Meet the Minds Behind Our Platform
        </h2>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Our diverse team of experts is passionate about connecting global talent with 
          AI training needs through blockchain technology.
        </p>
      </div>

      <div className="flex justify-center">
        {teamList.map(
          ({ imageUrl, firstName, lastName, position, bio, socialNetworks }) => (
            <Card
              key={`${firstName}-${lastName}`}
              className="bg-muted/30 dark:bg-card/70 flex flex-col h-full overflow-hidden group hover:border-primary/20 transition-colors duration-200 max-w-sm"
            >
              <div className="h-60 overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={`${firstName} ${lastName}`}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-xl">
                  {firstName}
                  <span className="text-primary ml-1">{lastName}</span>
                </CardTitle>
                <p className="text-muted-foreground font-medium">{position}</p>
              </CardHeader>

              <CardContent className="text-sm text-muted-foreground flex-grow">
                {bio}
              </CardContent>

              <CardFooter className="flex space-x-4 pt-2">
                {socialNetworks.map(({ name, url }, index) => (
                  <Link
                    key={index}
                    href={url}
                    target="_blank"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={name}
                  >
                    {socialIcon(name)}
                  </Link>
                ))}
              </CardFooter>
            </Card>
          )
        )}
      </div>

      {/* Join Us Section */}
      <div className="mt-20 text-center">
        <h3 className="text-2xl font-bold mb-3">Join Our Team</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          We're always looking for talented individuals passionate about AI, blockchain, 
          and creating innovative solutions. Check out our open positions.
        </p>
        <Link 
          href="mailto:gurusharanworks1@gmail.com" 
          className="text-primary hover:underline font-medium inline-flex items-center"
        >
          View Open Positions <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </section>
  );
};
