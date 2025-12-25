import CategoryBtn from "@/components/category/CategoryBtn";
import ProductCard from "@/components/sectionProduct/ProductCard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/categories/$categoryId")({
  component: CategoryPage,
});

function CategoryPage() {
  return (
    <div className="py-9">
      <p className="font-semibold text-center pl-3">Electronics</p>
      <div className="flex-center flex-wrap my-6 gap-4">
        <CategoryBtn />
        <CategoryBtn />
        <CategoryBtn />
        <CategoryBtn />
        <CategoryBtn />
      </div>
      <div className="flex-center flex-wrap my-6 gap-4">
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
      </div>
    </div>
  );
}
