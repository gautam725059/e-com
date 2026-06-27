import StoreLayout from "@/components/layout/StoreLayout";
import HeroSection from "@/components/home/HeroSection";
import MarqueeBar from "@/components/home/MarqueeBar";
import CategorySection from "@/components/home/CategorySection";
import TrustBar from "@/components/home/TrustBar";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import TrendingProducts from "@/components/home/TrendingProducts";
import DealOfDay from "@/components/home/DealOfDay";
import Testimonials from "@/components/home/Testimonials";
import BlogSection from "@/components/home/BlogSection";
import ContactSection from "@/components/home/ContactSection";

export default function Home() {
  return (
    <StoreLayout>
      <HeroSection />
      <MarqueeBar />
      <CategorySection />
      <TrustBar />
      <FeaturedProducts />
      <TrendingProducts />
      <DealOfDay />
      <Testimonials />
      <BlogSection />
      <ContactSection />
    </StoreLayout>
  );
}
