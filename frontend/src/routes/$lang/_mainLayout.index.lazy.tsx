import { createLazyFileRoute, getRouteApi } from "@tanstack/react-router";

import { BASE_URL } from "@/api/api.ts";
import CategorySection from "@/components/sectionCategory/CategorySection.tsx";
import Hero from "@/components/hero/Hero.tsx";
import Introduction from "@/components/introduction/Introduction.tsx";
import ProductSection from "@/components/sectionProduct/ProductSection.tsx";
import { useI18nContext } from "@/i18n/i18n-react";

// import { type Product } from "@/lib/types.ts";

// import axios from "axios";
// import { useEffect, useState } from "react";

// interface LoaderData {
//   productsForCarousel: Product[];
// }

// Передаем точный путь роута в функцию api
const routeApi = getRouteApi("/$lang/_mainLayout/");

export const Route = createLazyFileRoute("/$lang/_mainLayout/")({
  component: RouteComponent,
});

function RouteComponent() {
  // ------- Вариант-2 классический через  useEffect -----------
  // const [productsForCarousel, setProductsForCarousel] = useState<any[]>([]);
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   axios
  //     .get("https://e-shop-ts-back.onrender.com/api/products_for_carousel/")
  //     .then((res) => {
  //       setProductsForCarousel(res.data);
  //       setIsLoading(false);
  //     })
  //     .catch((err) => {
  //       console.error("Ошибка загрузки:", err);
  //       setIsLoading(false);
  //     });
  // }, []);

  // if (isLoading) return <div>Загрузка карусели...</div>;

  // --------- Вариант-1 через loader --------------------
  // Вызываем хук из созданного api-объекта
  const data = routeApi.useLoaderData();

  // Защитная проверка, чтобы TypeScript и React не ругались на undefined
  if (!data || !Array.isArray(data)) {
    return <div>Загрузка товаров карусели...</div>;
  }

  // --------- старый исходный вариант ----------------------
  // const { productsForCarousel } = Route.useLoaderData() as LoaderData;
  // -----------------------------------------------------------------

  const { LL } = useI18nContext();

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
        <meta property="og:image" content={`${Image}`} />
        <meta property="og:url" content={`${BASE_URL}`} />
      </>
      <main className="min-h-[85vh]">
        <Introduction />

        <Hero productsForCarousel={data} />
        {/* <Hero productsForCarousel={productsForCarousel} /> */}

        <CategorySection />

        <ProductSection
          title={`${LL.productSection.titleFeatured()}`}
          // similar_products={[]}
          // detailPage={false}
          // loadingFromDetailPage={false}
        />
      </main>
    </>
  );
}
