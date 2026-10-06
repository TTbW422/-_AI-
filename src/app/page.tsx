import { HeroSection } from '@/features/landing/components/hero-section';
import { FeaturesSection } from '@/features/landing/components/features-section';
import { HowItWorks } from '@/features/landing/components/how-it-works';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
    </main>
  );
}
