import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CiMedal , CiMap, CiGift} from "react-icons/ci";
import { FaRegPaperPlane } from "react-icons/fa";

interface FeatureProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

const features: FeatureProps[] = [
  {
    icon: <CiMedal />,
    title: "Real-Time Analytics",
    description:
      "Access real-time market data and trends to stay ahead. Utilize dynamic charts and crypto indicators to make informed decisions swiftly.",
  },
  {
    icon:<CiMap />,
    title: "Global Community",
    description:
      "Join a worldwide network of crypto traders. Share insights, discuss strategies, and enhance your trading knowledge through community wisdom.",
  },
  {
    icon: <FaRegPaperPlane />,
    title: "High Scalability",
    description:
      "Our platform scales to handle the needs of both new traders and professionals without sacrificing speed or reliability, supporting vast data volumes.",
  },
  {
    icon: <CiGift />,
    title: "Rewards System",
    description:
      "Engage continuously with our platform and earn rewards. Participate in competitions and challenges to win prizes and gain recognition.",
  },
];

export const HowItWorks = () => {
  return (
    <section
      id="howItWorks"
      className="text-center py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold ">
        How It{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Works{" "}
        </span>
        Step-by-Step Guide
      </h2>
      <p className="md:w-3/4 mx-auto mt-4 mb-8 text-xl text-muted-foreground">
        Explore how DexTrading enhances your crypto trading experience with advanced tools and features designed for optimal trading efficiency.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map(({ icon, title, description }: FeatureProps) => (
          <Card
            key={title}
            className="bg-muted/50 transition-shadow duration-300 hover:shadow-lg"
          >
            <CardHeader>
              <CardTitle className="grid gap-4 place-items-center">
                {icon}
                <span className="font-semibold">{title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>{description}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
