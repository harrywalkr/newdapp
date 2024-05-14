import { Button } from "@/components/ui/button";

export const Cta = () => {
  return (
    <section
      id="cta"
      className="bg-muted/50 py-16 my-24 sm:my-32"
    >
      <div className="lg:grid lg:grid-cols-2 place-items-center">
        <div className="lg:col-start-1">
          <h2 className="text-3xl md:text-4xl font-bold ">
            Master Your
            <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
              {" "}
              Crypto Trading{" "}
            </span>
            with Advanced Tools
          </h2>
          <p className="text-muted-foreground text-xl mt-4 mb-8 lg:mb-0">
            Unleash the power of cutting-edge analytics and real-time market data. Explore how our platform can transform your trading strategies into winning decisions.
          </p>
        </div>

        <div className="space-y-4 lg:col-start-2">
          <Button className="w-full md:mr-4 md:w-auto">Request a Demo</Button>
          <Button
            variant="outline"
            className="w-full md:w-auto"
          >
            Explore Features
          </Button>
        </div>
      </div>
    </section>
  );
};
