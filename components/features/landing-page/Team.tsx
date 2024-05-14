import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Facebook, Instagram, Linkedin } from "lucide-react";

interface TeamProps {
  imageUrl: string;
  name: string;
  position: string;
  bio: string;  // Added a bio for each team member
  socialNetworks: SocialNetworkProps[];
}

interface SocialNetworkProps {
  name: string;
  url: string;
}

const teamList: TeamProps[] = [
  {
    imageUrl: "https://i.pravatar.cc/150?img=35",
    name: "Emma Smith",
    position: "Product Manager",
    bio: "Emma drives our product strategy and was instrumental in the conceptualization and launch of our market-leading analytics platform.",
    socialNetworks: [
      { name: "Linkedin", url: "http://linkedin.com/in/emmasmith" },
      { name: "Facebook", url: "https://www.facebook.com/emmasmith" },
      { name: "Instagram", url: "https://www.instagram.com/emmasmith" },
    ],
  },
  {
    imageUrl: "https://i.pravatar.cc/150?img=35",
    name: "Emma Smith",
    position: "Product Manager",
    bio: "Emma drives our product strategy and was instrumental in the conceptualization and launch of our market-leading analytics platform.",
    socialNetworks: [
      { name: "Linkedin", url: "http://linkedin.com/in/emmasmith" },
      { name: "Facebook", url: "https://www.facebook.com/emmasmith" },
      { name: "Instagram", url: "https://www.instagram.com/emmasmith" },
    ],
  },
  {
    imageUrl: "https://i.pravatar.cc/150?img=35",
    name: "Emma Smith",
    position: "Product Manager",
    bio: "Emma drives our product strategy and was instrumental in the conceptualization and launch of our market-leading analytics platform.",
    socialNetworks: [
      { name: "Linkedin", url: "http://linkedin.com/in/emmasmith" },
      { name: "Facebook", url: "https://www.facebook.com/emmasmith" },
      { name: "Instagram", url: "https://www.instagram.com/emmasmith" },
    ],
  },
  // Additional team members...
];

export const Team = () => {
  const socialIcon = (iconName: string) => {
    switch (iconName) {
      case "Linkedin":
        return <Linkedin size="20" />;
      case "Facebook":
        return <Facebook size="20" />;
      case "Instagram":
        return <Instagram size="20" />;
      default:
        return null;  // It's a good practice to handle the default case
    }
  };

  return (
    <section id="team" className="py-24 sm:py-32">
      <h2 className="text-3xl md:text-4xl font-bold">
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Meet Our{" "}
        </span>
        Expert Team
      </h2>

      <p className="mt-4 mb-10 text-xl text-muted-foreground">
        Meet the brilliant minds behind our cutting-edge crypto analysis tools.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 gap-y-10">
        {teamList.map(({ imageUrl, name, position, bio, socialNetworks }: TeamProps) => (
          <Card key={name} className="bg-muted/50 text-center">
            <CardHeader>
              <Avatar className="w-24 h-24 rounded-full mx-auto">
                <AvatarImage src={imageUrl} alt={`${name}, ${position}`} />
              </Avatar>
              <CardTitle>{name}</CardTitle>
              <CardDescription className="text-primary">{position}</CardDescription>
            </CardHeader>

            <CardContent>
              <p>{bio}</p>
            </CardContent>

            <CardFooter>
              {socialNetworks.map(({ name, url }: SocialNetworkProps) => (
                <a key={name} href={url} target="_blank" rel="noreferrer noopener" className="inline-block mx-2">
                  {socialIcon(name)}
                </a>
              ))}
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
