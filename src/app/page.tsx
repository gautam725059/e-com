import StoreLayout from "@/components/layout/StoreLayout";
import HeroSection from "@/components/home/HeroSection";
import TrustBar from "@/components/home/TrustBar";
import CategorySection from "@/components/home/CategorySection";
import DealOfDay from "@/components/home/DealOfDay";
import TrendingProducts from "@/components/home/TrendingProducts";
import FeaturedBanner from "@/components/home/FeaturedBanner";
import WhyShanya from "@/components/home/WhyShanya";
import Testimonials from "@/components/home/Testimonials";
import FaqSection from "@/components/home/FaqSection";
import { getCatalog } from "@/lib/catalog";

export const revalidate = 10;

export default async function Home() {
  const catalog = await getCatalog();
  const deal = catalog.find((p) => p.id === 8) ?? catalog[0];

  return (
    <StoreLayout>
      <HeroSection />
      <TrustBar />
      <CategorySection />
      <DealOfDay deal={deal} />
      <TrendingProducts products={catalog} />
      <FeaturedBanner />
      <WhyShanya />
      <Testimonials />
      <FaqSection />
    </StoreLayout>
  );
}
