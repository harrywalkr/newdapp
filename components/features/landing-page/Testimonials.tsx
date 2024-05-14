import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TestimonialProps {
  image: string;
  name: string;
  userName: string;
  comment: string;
}

const testimonials: TestimonialProps[] = [
  {
    image: "https://example.com/images/user1.png",
    name: "Alice Johnson",
    userName: "@alice_crypto",
    comment: "The real-time data and market insights from this platform have dramatically improved my trading strategies and results.",
  },
  {
    image: "https://example.com/images/user2.png",
    name: "Bob Smith",
    userName: "@bob_trader",
    comment: "I appreciate the intuitive design and how easy it is to navigate the complex world of crypto trading with this app.",
  },
  {
    image: "https://example.com/images/user3.png",
    name: "Cathy Lee",
    userName: "@cathy_hodl",
    comment: "Automated trading has never been easier. I set my parameters, and the system executes flawlessly, saving me time and reducing stress.",
  },
  {
    image: "https://example.com/images/user4.png",
    name: "David Park",
    userName: "@david_invests",
    comment: "Portfolio management tools on this platform are second to none. I can easily review my investments and make adjustments on the fly.",
  },
  {
    image: "https://example.com/images/user5.png",
    name: "Eva Grant",
    userName: "@eva_analytics",
    comment: "Thanks to the predictive algorithms, I'm making more informed decisions that are based on solid data analytics.",
  },
];

export const Testimonials = () => {
  return (
    <section
      id="testimonials"
      className="py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold">
        Discover Why
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          {" "}
          Traders Trust Us
        </span>
      </h2>

      <p className="text-xl text-muted-foreground pt-4 pb-8">
        Here’s what our users say about leveraging our cutting-edge tools to enhance their trading success.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map(({ image, name, userName, comment }: TestimonialProps) => (
          <Card key={userName} className="bg-muted/70 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Avatar>
                <AvatarImage src={image} alt={`Profile of ${name}`} />
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <CardTitle className="text-lg">{name}</CardTitle>
                <CardDescription>{userName}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>{comment}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
