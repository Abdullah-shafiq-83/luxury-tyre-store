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
      { name: "description", content: "Shop premium performance tyres and bespoke alloy rims at TyreLux. Fast delivery, free fitting, and a 5-year warranty." },
      { property: "og:title", content: "TyreLux — Premium Tyres & Alloy Rims" },
      { property: "og:description", content: "Shop premium performance tyres and bespoke alloy rims. Fast delivery, free fitting." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://luxury-tyre-store.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://luxury-tyre-store.lovable.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              name: "TyreLux",
              url: "https://luxury-tyre-store.lovable.app/",
              description: "Premium tyres and bespoke alloy rims, with free fitting and a 5-year warranty.",
            },
            {
              "@type": "WebSite",
              name: "TyreLux",
              url: "https://luxury-tyre-store.lovable.app/",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://luxury-tyre-store.lovable.app/shop?brand={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            },
          ],
        }),
      },
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
