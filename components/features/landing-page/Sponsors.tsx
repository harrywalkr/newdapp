import { Radar } from "lucide-react";
import Image from "next/image";

interface SponsorProps {
  icon: JSX.Element;
  name: string;
}

const sponsors: SponsorProps[] = [
  {
    icon: <Radar size={34} />,
    name: "Blockchain Innovations Corp",
  },
  {
    icon: <Radar size={34} />,
    name: "Crypto Ventures",
  },
  {
    icon: <Radar size={34} />,
    name: "DeFi Analytics Ltd",
  },
  {
    icon: <Radar size={34} />,
    name: "Token Metrics Inc",
  },
  {
    icon: <Radar size={34} />,
    name: "Digital Asset Research",
  },
  {
    icon: <Radar size={34} />,
    name: "Market Insights Group",
  },
];

export const Sponsors = () => {
  return (
    <section
      id="sponsors"
      className="pt-24 sm:py-32 bg-background-light" // Added a background for better contrast
    >
      {/* <h2 className="text-center text-md lg:text-xl font-bold mb-8 text-primary">
        Our Trusted Partners
      </h2>

      <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
        {sponsors.map(({ icon, name }: SponsorProps) => (
          <div
            key={name}
            className="flex flex-col items-center gap-2 text-muted-foreground/60"
          >
            <span>{icon}</span>
            <h3 className="text-lg font-bold">{name}</h3>
          </div>
        ))}
      </div> */}
      <div className="flex items-center justify-start gap-5">
        <div className="flex flex-col items-center justify-center gap-4 flex-1 bg-muted/50 py-10 rounded-md">
          <h1 className="text-2xl font-bold">
            Partnership with TradingView
          </h1>
          <div className="flex items-center justify-center gap-3">
            <Image src='/tradingview.png' alt="trading-view-logo" width={70} height={70} />
            <Image src='/dextrading-logo.svg' alt="trading-view-logo" width={45} height={45} />
          </div>
        </div>
        <p className="text-lg flex-[2]">
          Upcomers leverages TradingView technology, renowned for its
          advanced charting tools and access to the economic calendar,
          enabling users to
          <a
            href="https://www.tradingview.com/economic-calendar/"
            className="text-blue-500 underline hover:text-blue-700"
          >
            {" "}
            learn how to use the economic calendar effectively
          </a>
          {" "}
          and
          {" "}

          <a
            href="https://www.tradingview.com/screener/"
            className="text-blue-500 underline hover:text-blue-700"
          >
            how to use a stock screener for trade planning
          </a>
          .
        </p>
      </div>
    </section>
  );
};
