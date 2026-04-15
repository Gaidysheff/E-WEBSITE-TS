import { createFileRoute } from "@tanstack/react-router";

import ProductSection from "@/components/sectionProduct/ProductSection";

import { toast } from "react-toastify";
import Error from "@/components/error/Error.tsx";
import ProductInfoSkeleton from "@/components/productDetail/ProductInfoSkeleton.tsx";
import ReviewCardContainerSkeleton from "@/components/productDetail/ReviewCardContainerSkeleton.tsx";
import CustomerReviewsSkeleton from "@/components/productDetail/CustomerReviewsSkeleton.tsx";

import { type ProductInDetails } from "@/lib/types.ts";
import { PRODUCT_DETAIL_PAGE_URL } from "@/api/endpoints.ts";
import api from "@/api/api.ts";

export const Route = createFileRoute("/products/$productSlug")({
  loader: async ({ params: { productSlug } }) => {
    // ---------- Loading Delay ----------
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    try {
      const response = await api.get<ProductInDetails>(
        `${PRODUCT_DETAIL_PAGE_URL}${productSlug}`,
      );
      return {
        product: response.data,
      };
    } catch (error) {
      throw error;
    }
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
});
