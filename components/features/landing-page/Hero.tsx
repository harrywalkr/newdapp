import { Button } from "@/components/ui/button";
import { HeroCards } from "./HeroCards";

export const Hero = () => {
  return (
    <section className="container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10">
      <div className="text-center lg:text-start space-y-6">
        <main className="text-5xl md:text-6xl font-bold">
          <h1 className="inline text-5xl md:text-7xl">
            <span className="inline text-brand">
              DexTrading: Empowering Crypto Traders
            </span>
          </h1>
        </main>

        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          Unlock advanced crypto trading insights with DexTrading. Our platform offers real-time analysis, predictive market algorithms, and comprehensive trading tools designed to optimize your strategies and enhance market understanding.
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <Button className="w-full md:w-1/3">Get Started</Button>
        </div>
      </div>

      {/* Hero cards sections showcasing key features or tools */}
      <div className="z-10">
        <HeroCards />
      </div>

      {/* Shadow effect for visual depth */}
      <div className="shadow"></div>
    </section>
  );
};
