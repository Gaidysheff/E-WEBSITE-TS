import CustomerReviews from "@/components/productDetail/CustomerReviews";
import ProductInfo from "@/components/productDetail/ProductInfo";
import ProductSection from "@/components/sectionProduct/ProductSection";
import ReviewCardContainer from "@/components/productDetail/ReviewCardContainer";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/products/$productSlug")({
  component: IndividualProductComponent,
});

function IndividualProductComponent() {
  return (
    <>
      <ProductInfo />
      <CustomerReviews />
      <ReviewCardContainer />
      <ProductSection title="Products from the same category" />
    </>
  );
}
