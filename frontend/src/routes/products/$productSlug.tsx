import CustomerReviews from "@/components/productDetail/CustomerReviews";
import ProductInfo from "@/components/productDetail/ProductInfo";
import ProductSection from "@/components/sectionProduct/ProductSection";
import ReviewCardContainer from "@/components/productDetail/ReviewCardContainer";
import { createFileRoute } from "@tanstack/react-router";
import { PRODUCT_DETAIL_PAGE_URL } from "@/api/endpoints.ts";
import api from "@/api/api.ts";
import { type ProductInDetails, type Product } from "@/lib/types.ts";
import { toast } from "react-toastify";
import Error from "@/components/error/Error.tsx";
import ProductInfoSkeleton from "@/components/productDetail/ProductInfoSkeleton.tsx";
import ReviewCardContainerSkeleton from "@/components/productDetail/ReviewCardContainerSkeleton.tsx";
import CustomerReviewsSkeleton from "@/components/productDetail/CustomerReviewsSkeleton.tsx";

export const Route = createFileRoute("/products/$productSlug")({
  loader: async ({ params: { productSlug } }) => {
    // ---------- Loading Delay ----------
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    const response = await api.get<ProductInDetails>(
      `${PRODUCT_DETAIL_PAGE_URL}${productSlug}`,
    );
    if (response.status !== 200) {
      throw Error();
    }
    return {
      _product: response.data,
    };
  },

  pendingComponent: () => (
    <>
      <ProductInfoSkeleton />
      <CustomerReviewsSkeleton />
      <ReviewCardContainerSkeleton />
      <ProductSection
        title=""
        similar_products={[]}
        detailPage
        loadingFromDetailPage={true}
      />
    </>
  ),

  errorComponent: () => {
    toast.error("Something went wrong");
    return <Error />;
  },

  component: IndividualProductComponent,
});

function IndividualProductComponent() {
  const { _product } = Route.useLoaderData();
  const product: ProductInDetails = _product;

  const reviews = product.reviews;

  const similar_products: Product[] = product.similar_products;

  const isAuthorized = !!localStorage.getItem("Token");

  return (
    <>
      <ProductInfo
        product={product}
        // isAuthorized={isAuthorized}
      />

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
