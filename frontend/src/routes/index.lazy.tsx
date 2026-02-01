import CategorySection from "@/components/sectionCategory/CategorySection.tsx";
import Hero from "@/components/hero/Hero.tsx";
import Introduction from "@/components/introduction/Introduction.tsx";
import ProductSection from "@/components/sectionProduct/ProductSection.tsx";
import { createLazyFileRoute } from "@tanstack/react-router";
import { type Product } from "@/lib/types.ts";

interface LoaderData {
  productsForCarousel: Product[];
}

export const Route = createLazyFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { productsForCarousel } = Route.useLoaderData() as LoaderData;

  return (
    <main className="min-h-[85vh]">
      <Introduction />

      <Hero productsForCarousel={productsForCarousel} />

      <CategorySection />
      <ProductSection
        title="Featured Products"
        similar_products={[]}
        detailPage={false}
        loadingFromDetailPage={false}
      />
    </main>
  );
}
