import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { ProofSection } from "@/components/landing/ProofSection";
import { OpportunitySection } from "@/components/landing/OpportunitySection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { CreatorStory } from "@/components/landing/CreatorStory";
import { EarningsCalculator } from "@/components/landing/EarningsCalculator";
import { FAQSection } from "@/components/landing/FAQSection";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

export default function KrissKrossJobs() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <Hero />
      <ProofSection />
      <OpportunitySection />
      <HowItWorksSection />
      <CreatorStory />
      <EarningsCalculator />
      <FAQSection />
      <FinalCTA />
      <Footer />
    </div>
  );
}
