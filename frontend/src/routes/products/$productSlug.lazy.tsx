import { createLazyFileRoute } from "@tanstack/react-router";
import CustomerReviews from "@/components/productDetail/CustomerReviews";
import ProductInfo from "@/components/productDetail/ProductInfo";
import ProductSection from "@/components/sectionProduct/ProductSection";
import ReviewCardContainer from "@/components/productDetail/ReviewCardContainer";

import { type ProductInDetails } from "@/lib/types.ts";

interface LoaderData {
  product: ProductInDetails;
}

export const Route = createLazyFileRoute("/products/$productSlug")({
  component: IndividualProductComponent,
});

function IndividualProductComponent() {
  const { product } = Route.useLoaderData() as LoaderData;

  const reviews = product.reviews;

  const similar_products = product.similar_products;

  const isAuthorized = !!localStorage.getItem("Token");

  return (
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
  );
}
