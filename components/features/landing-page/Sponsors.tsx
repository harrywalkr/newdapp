import { Radar } from "lucide-react";

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
      <h2 className="text-center text-md lg:text-xl font-bold mb-8 text-primary">
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
      </div>
    </section>
  );
};
