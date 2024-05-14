import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

enum PopularPlanType {
  NO = 0,
  YES = 1,
}

interface PricingProps {
  title: string;
  popular: PopularPlanType;
  price: number;
  description: string;
  buttonText: string;
  benefitList: string[];
}

const pricingList: PricingProps[] = [
  {
    title: "Basic",
    popular: 0,
    price: 0,
    description:
      "Start exploring the crypto market with basic analytics and data access.",
    buttonText: "Get Started",
    benefitList: [
      "Access to basic market analytics",
      "Community support",
      "Real-time data",
      "2 custom alerts",
      "API access with limited requests",
    ],
  },
  {
    title: "Pro",
    popular: 1,
    price: 29,
    description:
      "Enhance your trading with advanced insights and more comprehensive tools.",
    buttonText: "Start Free Trial",
    benefitList: [
      "All Basic features plus:",
      "Advanced analytical tools",
      "Unlimited custom alerts",
      "Priority support",
      "API access with higher limits",
      "Historical data access",
    ],
  },
  {
    title: "Enterprise",
    popular: 0,
    price: 99,
    description:
      "Full-scale solutions designed for high-volume trading and deep analytics.",
    buttonText: "Contact Us",
    benefitList: [
      "All Pro features plus:",
      "Premium market insights",
      "Dedicated account manager",
      "Webhooks support",
      "Machine learning insights",
      "Custom data solutions",
    ],
  },
];

export const Pricing = () => {
  return (
    <section id="pricing" className="py-24 sm:py-32">
      <h2 className="text-3xl md:text-4xl font-bold text-center">
        Choose Your{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Plan
        </span>
      </h2>
      <h3 className="text-xl text-center text-muted-foreground pt-4 pb-8">
        Select the plan that best suits your crypto trading and analysis needs.
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pricingList.map((pricing: PricingProps) => (
          <Card
            key={pricing.title}
            className={`bg-muted/50 transition-all duration-300 ease-in-out ${
              pricing.popular === PopularPlanType.YES ? "ring ring-primary ring-offset-2" : ""
            }`}
          >
            <CardHeader>
              <CardTitle className="flex item-center justify-between">
                {pricing.title}
                {pricing.popular === PopularPlanType.YES && (
                  <Badge variant="secondary" className="text-sm">
                    Most Popular
                  </Badge>
                )}
              </CardTitle>
              <div>
                <span className="text-3xl font-bold">${pricing.price}</span>
                <span className="text-muted-foreground"> /month</span>
              </div>

              <CardDescription>{pricing.description}</CardDescription>
            </CardHeader>

            <CardContent>
              <Button className="w-full">{pricing.buttonText}</Button>
            </CardContent>

            <hr className="w-4/5 m-auto mb-4" />

            <CardFooter>
              <ul className="list-none space-y-2">
                {pricing.benefitList.map((benefit: string) => (
                  <li key={benefit} className="flex items-center">
                    <Check className="text-green-500 mr-2" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
