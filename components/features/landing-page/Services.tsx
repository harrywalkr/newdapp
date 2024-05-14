import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { IoAnalytics } from "react-icons/io5";
import { MdManageSearch, MdOutlineAutoMode } from "react-icons/md";

interface ServiceProps {
  title: string;
  description: string;
  icon: JSX.Element;
}

const serviceList: ServiceProps[] = [
  {
    title: "Advanced Analytics",
    description:
      "Harness powerful computing to unlock complex market trends and predictive insights, helping you navigate the volatile crypto market.",
    icon: <IoAnalytics />
  },
  {
    title: "Portfolio Management",
    description:
      "Manage and track your cryptocurrency investments with our intuitive tools that provide real-time updates and comprehensive risk analysis.",
    icon: <MdManageSearch />
  },
  {
    title: "Smart Trading Automation",
    description:
      "Automate your trading strategies using our robust, secure, and flexible tools. Set parameters and let our system execute trades on your behalf.",
    icon:<MdOutlineAutoMode />
  },
];

export const Services = () => {
  return (
    <section className="py-24 sm:py-32">
      <div className="grid lg:grid-cols-[1fr,1fr] gap-8 place-items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
              Crypto-Centric{" "}
            </span>
            Services
          </h2>

          <p className="text-muted-foreground text-xl mt-4 mb-8 ">
            Dive deep into the crypto ecosystem with our tailored services designed to enhance your trading efficiency and market understanding.
          </p>

          <div className="flex flex-col gap-8">
            {serviceList.map(({ icon, title, description }: ServiceProps) => (
              <Card key={title}>
                <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
                  <div className="mt-1 bg-primary/20 p-1 rounded-2xl">
                    {icon}
                  </div>
                  <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription className="text-md mt-2">
                      {description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
        <Image
          src='/landing-page/cube-leg.png'  // Changed to a more appropriate image if available
          width={500}
          height={500}
          className="w-[300px] md:w-[500px] lg:w-[600px] object-contain"
          alt="Crypto services illustration"
        />
      </div>
    </section>
  );
};
