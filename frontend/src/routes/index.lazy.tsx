import CategorySection from "@/components/sectionCategory/CategorySection.tsx";
import Hero from "@/components/hero/Hero.tsx";
import Introduction from "@/components/introduction/Introduction.tsx";
import ProductSection from "@/components/sectionProduct/ProductSection.tsx";
import { createLazyFileRoute } from "@tanstack/react-router";
import { type Product } from "@/lib/types.ts";
import { BASE_URL } from "@/api/api";

interface LoaderData {
  productsForCarousel: Product[];
}

export const Route = createLazyFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { productsForCarousel } = Route.useLoaderData() as LoaderData;

  return (
    <>
      <>
        {/* <link rel="icon" type="image/svg+xml" href="/EugeneCat_Logo.ico" /> */}
        <meta
          name="description"
          content="E-Shop online shop providing e-commerce services !!!"
        />
        {/* <link rel="canonical" href="http://localhost:5173" /> */}
        <link rel="canonical" href={`${BASE_URL}`} />
        {/* <meta name="keywords" content="main,e-Shop" /> */}
        <meta property="og:title" content="Eshop | OG:Title" />
        <meta property="og:description" content="This is OG:Description" />
        <meta property="og:image" content={"${Image}"} />
        <meta property="og:url" content={`${BASE_URL}`} />
      </>
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
    </>
  );
}
