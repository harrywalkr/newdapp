import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Check, Linkedin } from "lucide-react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { FaRegLightbulb } from "react-icons/fa";

export const HeroCards = () => {
  return (
    <div className="hidden lg:flex flex-row flex-wrap gap-8 relative w-[700px] h-[500px]">
      {/* Testimonial Card */}
      <Card className="absolute w-[340px] -top-[15px] drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="User Testimonial" />
            <AvatarFallback>SH</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <CardTitle className="text-lg">John Doe React</CardTitle>
            <CardDescription>@john_doe</CardDescription>
          </div>
        </CardHeader>
        <CardContent>"This landing page is awesome!"</CardContent>
      </Card>

      {/* Team Card */}
      <Card className="absolute right-[20px] top-4 w-80 flex flex-col justify-center items-center drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="mt-8 flex justify-center items-center pb-2">
          <Image src="https://i.pravatar.cc/150?img=58" alt="Leo Miranda" width={96} height={96} className="rounded-full" />
          <CardTitle className="text-center">Leo Miranda</CardTitle>
          <CardDescription className="font-normal text-primary">Frontend Developer</CardDescription>
        </CardHeader>
        <CardContent className="text-center pb-2">
          "I really enjoy transforming ideas into functional software that exceeds expectations."
        </CardContent>
        <CardFooter>
          <div className="flex gap-2">
            <a href="https://github.com/leoMirandaa" target="_blank" rel="noopener noreferrer" className="text-lg">
              <GitHubLogoIcon className="w-6 h-6" />
            </a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="text-lg">
              <Linkedin size="24" />
            </a>
          </div>
        </CardFooter>
      </Card>

      {/* Pricing Card */}
      <Card className="absolute top-[150px] left-[50px] w-72 drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Free
            <Badge variant="secondary" className="text-sm text-primary">Most popular</Badge>
          </CardTitle>
          <div>
            <span className="text-3xl font-bold">$0</span>
            <span className="text-muted-foreground"> /month</span>
          </div>
          <CardDescription>Get started with our basic features at no cost.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full">Start Free Trial</Button>
        </CardContent>
        <hr className="w-4/5 m-auto mb-4" />
        <CardFooter className="flex flex-col space-y-2">
          {["4 Team member", "4 GB Storage", "Upto 6 pages"].map(benefit => (
            <div key={benefit} className="flex items-center">
              <Check className="text-green-500 mr-2" />
              {benefit}
            </div>
          ))}
        </CardFooter>
      </Card>

      {/* Service Card */}
      <Card className="absolute w-[350px] -right-[10px] bottom-[35px] drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="space-y-1 flex flex-row justify-start items-start gap-4">
          <div className="mt-1 bg-primary/20 p-2 rounded-xl">
            <FaRegLightbulb className="text-xl" />
          </div>
          <div>
            <CardTitle>Light & Dark Mode</CardTitle>
            <CardDescription className="text-md">
              Experience seamless usability in any lighting condition with our adaptive interface.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};
