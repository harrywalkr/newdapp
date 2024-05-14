import { About } from "@/components/features/landing-page/About";
import { Cta } from "@/components/features/landing-page/Cta";
import { FAQ } from "@/components/features/landing-page/FAQ";
import { Features } from "@/components/features/landing-page/Features";
import { Hero } from "@/components/features/landing-page/Hero";
import { HowItWorks } from "@/components/features/landing-page/HowItWorks";
import { Newsletter } from "@/components/features/landing-page/Newsletter";
import { Pricing } from "@/components/features/landing-page/Pricing";
import { ScrollToTop } from "@/components/features/landing-page/ScrollToTop";
import { Services } from "@/components/features/landing-page/Services";
import { Sponsors } from "@/components/features/landing-page/Sponsors";
import { Team } from "@/components/features/landing-page/Team";
import { Testimonials } from "@/components/features/landing-page/Testimonials";

function Landing() {
  return (
    <>
      <Hero />
      <Sponsors />
      <About />
      <HowItWorks />
      <Features />
      <Services />
      <Cta />
      <Testimonials />
      <Team />
      <Pricing />
      <Newsletter />
      <FAQ />
      <ScrollToTop />
    </>
  );
}

export default Landing;