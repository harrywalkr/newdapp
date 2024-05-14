import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import growthImage from "@/public/landing-page/growth.png";
import reflectingImage from "@/public/landing-page/reflecting.png";
import lookingAheadImage from "@/public/landing-page/looking-ahead.png";
import Image, { StaticImageData } from "next/image";

interface FeatureProps {
  title: string;
  description: string;
  image: StaticImageData;
}

const features: FeatureProps[] = [
  {
    title: "Advanced Chart Tools",
    description:
      "Utilize state-of-the-art charting tools to visualize trading data and analyze market trends with precision.",
    image: lookingAheadImage,
  },
  {
    title: "Market Sentiment Analysis",
    description:
      "Gain insights into market sentiment through advanced analytics, helping you make informed trading decisions.",
    image: reflectingImage,
  },
  {
    title: "Predictive AI Algorithms",
    description:
      "Leverage artificial intelligence to predict market movements and get a competitive edge in your trading strategy.",
    image: growthImage,
  },
];

const featureList: string[] = [
  "Real-time Updates",
  "Community Insights",
  "Secure Transactions",
  "Portfolio Management",
  "Risk Assessment Tools",
  "Crypto-specific Analytics",
  "User-friendly Interface",
  "24/7 Support",
  "Mobile Compatibility",
];

export const Features = () => {
  return (
    <section
      id="features"
      className="py-24 sm:py-32 space-y-8"
    >
      <h2 className="text-3xl lg:text-4xl font-bold md:text-center">
        Explore Our{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Powerful Features
        </span>
      </h2>

      <div className="flex flex-wrap md:justify-center gap-4">
        {featureList.map((feature: string) => (
          <div key={feature}>
            <Badge
              variant="secondary"
              className="text-sm"
            >
              {feature}
            </Badge>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map(({ title, description, image }: FeatureProps) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>

            <CardContent>{description}</CardContent>

            <CardFooter>
              <Image
                src={image}
                alt={`${title} illustration`}
                className="w-full mx-auto" // adjusted for responsiveness and full width
                layout="responsive" // added for better image scaling
                width={300} // set width for responsive layout
                height={200} // set height to maintain aspect ratio
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
