import HomeHeader from '@/components/home/home-header'
import HeroSection from '@/components/home/hero-section'
import FeaturesSection from '@/components/home/features-section'
import CoursesPreview from '@/components/home/courses-preview'
import CTASection from '@/components/home/cta-section'
import HomeFooter from '@/components/home/home-footer'

export default function HomePage() {
  return (
    <main className="flex flex-col w-full">
      <HomeHeader />
      <HeroSection />
      <FeaturesSection />
      <CoursesPreview />
      <CTASection />
      <HomeFooter />
    </main>
  )
}
