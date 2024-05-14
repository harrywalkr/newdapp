'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Newsletter = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Subscribed!");
    // Ideally, add an API call here to actually subscribe the user
  };

  return (
    <section id="newsletter">
      <hr className="w-11/12 mx-auto" />
      <div className="py-24 sm:py-32">
        <h3 className="text-center text-4xl md:text-5xl font-bold">
          Stay Updated with Our{" "}
          <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
            Crypto Insights
          </span>
        </h3>
        <p className="text-xl text-muted-foreground text-center mt-4 mb-8">
          Subscribe to receive the latest crypto market trends, analysis, and updates directly to your inbox.
        </p>

        <form
          className="flex flex-col w-full md:flex-row md:w-6/12 lg:w-4/12 mx-auto gap-4 md:gap-2"
          onSubmit={handleSubmit}
        >
          <Input
            type="email"  // specify the type to get email-specific keyboard on mobile
            placeholder="Enter your email"
            className="bg-muted/50 dark:bg-muted/80 px-4 py-2 rounded-md" // improved styling for better UX
            aria-label="Enter your email to subscribe"  // more descriptive aria-label
            required  // ensure the form cannot be submitted without an email
          />
          <Button >
            Subscribe
          </Button>
        </form>
      </div>
      <hr className="w-11/12 mx-auto" />
    </section>
  );
};
