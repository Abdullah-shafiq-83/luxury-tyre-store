import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Hero } from "@/components/Hero";
import { TyreluxFeatures } from "@/components/TyreluxFeatures";
import { VehicleSelector } from "@/components/VehicleSelector";
import { TopPicks } from "@/components/TopPicks";
import { StatsSection } from "@/components/StatsSection";
import { BrandsRow } from "@/components/BrandsRow";
import { ReviewsCarousel } from "@/components/ReviewsCarousel";
import { Newsletter } from "@/components/Newsletter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TyreLux — Premium Tyres & Alloy Rims" },
      { name: "description", content: "Shop premium performance tyres and bespoke alloy rims. Fast delivery, free fitting." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <Layout>
      <Hero />
      <TyreluxFeatures />
      <VehicleSelector />
      <TopPicks />
      <StatsSection />
      <BrandsRow />
      <ReviewsCarousel />
      <Newsletter />
    </Layout>
  );
}
