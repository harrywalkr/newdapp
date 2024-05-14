import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "How does your platform ensure the security of my data?",
    answer: "We prioritize your data security by employing state-of-the-art encryption and by adhering to stringent global security standards.",
    value: "item-1",
  },
  {
    question: "Can I access real-time market data with your free plan?",
    answer: "Yes, our free plan provides limited real-time market data. For more comprehensive access, consider upgrading to our Premium or Enterprise plans.",
    value: "item-2",
  },
  {
    question: "What types of predictive analytics tools do you offer?",
    answer: "Our platform features AI-driven predictive analytics tools that analyze market trends and provide actionable insights to help you make informed trading decisions.",
    value: "item-3",
  },
  {
    question: "How can I learn to use your platform effectively?",
    answer: "We offer a variety of resources including tutorials, webinars, and a dedicated support team to help you navigate and make the most of our platform.",
    value: "item-4",
  },
  {
    question: "What support options are available for Enterprise clients?",
    answer: "Enterprise clients benefit from 24/7 priority support, a dedicated account manager, and access to bespoke data analysis services.",
    value: "item-5",
  },
];

export const FAQ = () => {
  return (
    <section id="faq" className="py-24 sm:py-32 flex flex-col items-center justify-center gap-2">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Frequently Asked{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Crypto Questions
        </span>
      </h2>

      <Accordion
        type="single"
        collapsible
        className="w-full max-w-4xl"
      >
        {FAQList.map(({ question, answer, value }: FAQProps) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger className="text-left px-4 py-3 rounded-md bg-muted/50 hover:bg-muted/70 transition-colors">
              {question}
            </AccordionTrigger>
            <AccordionContent className="px-4 py-2 text-left">
              {answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h3 className="font-medium mt-4 text-center">
        Still have questions?{" "}
        <a
          href="/contact"
          className="text-primary transition-all border-primary hover:border-b-2"
        >
          Contact us
        </a>
      </h3>
    </section>
  );
};
