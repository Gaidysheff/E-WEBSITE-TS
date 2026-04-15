import { BASE_URL } from "@/api/api";
import CustomerReviews from "@/components/productDetail/CustomerReviews";
import ProductInfo from "@/components/productDetail/ProductInfo";
import ReviewCardContainer from "@/components/productDetail/ReviewCardContainer";
import ProductSection from "@/components/sectionProduct/ProductSection";
import usePageSEO from "@/hooks/usePageSEO.ts";
import { type ProductInDetails } from "@/lib/types.ts";
import { createLazyFileRoute, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

interface LoaderData {
  product: ProductInDetails;
}

export const Route = createLazyFileRoute("/products/$productSlug")({
  component: IndividualProductComponent,
});

function IndividualProductComponent() {
  const { product } = Route.useLoaderData() as LoaderData;

  const reviews = product.reviews;
  // const [reviews, setReviews] = useState([]);

  const similar_products = product.similar_products;

  const isAuthorized = !!localStorage.getItem("Token");

  const routerState = useRouterState();
  const currentPathname = routerState.location.pathname;

  usePageSEO({
    title: `Eshop | ${product.name}`,
    description: `This page presents the information about ${product.name}`,
  });

  useEffect(() => {}, [product.reviews]);

  return (
    <>
      <>
        <link
          rel="icon"
          type="image/png"
          href="/gift-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/gift.svg" sizes="any2" />

        <link rel="canonical" href={`${BASE_URL}${currentPathname}`} />
      </>

      <>
        <ProductInfo product={product} isAuthorized={isAuthorized} />

        <CustomerReviews
          product={product}
          isAuthorized={isAuthorized}
          reviews={reviews}
        />

        {reviews.length > 0 ? (
          <ReviewCardContainer reviews={reviews} product={product} />
        ) : (
          <div className="flex items-center justify-between space-x-4 px-4 pb-10">
            <h4 className="font-semibold text-primaryDark">
              Reviews(0) - there no reviews for the time being."{" "}
            </h4>
          </div>
        )}

        <ProductSection
          title="Products from the same category"
          similar_products={similar_products}
          detailPage
          loadingFromDetailPage={false}
        />
      </>
    </>
  );
}
