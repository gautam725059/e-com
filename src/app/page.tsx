import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import FeaturedProducts from "@/components/FeaturedProducts";
import Promotion from "@/components/Promotion";
import WhatWeOffer from "@/components/WhatWeOffer";
import TrendingProducts from "@/components/TrendingProducts";
import DiscountItems from "@/components/DiscountItems";
import TopCategories from "@/components/TopCategories";
import LatestBlog from "@/components/LatestBlog";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Promotion />
      <main className="bg-white">
        <FeaturedProducts />
        <DiscountItems />
        <TrendingProducts />
        <TopCategories />
        <WhatWeOffer />
        <LatestBlog />
      </main>

      <Footer />
    </>
  );
}