import { createLazyFileRoute } from "@tanstack/react-router";

import { BASE_URL } from "@/api/api";
import CategoryBtn from "@/components/category/CategoryBtn";

import ProductCard from "@/components/sectionProduct/ProductCard";

import { type Category, type CategoryWithProducts } from "@/lib/types.ts";

interface LoaderData {
  selectedCategory: CategoryWithProducts;
  categories: Category[];
}

export const Route = createLazyFileRoute("/categories/$categoryId")({
  component: CategoryPage,
});

function CategoryPage() {
  const { selectedCategory, categories } = Route.useLoaderData() as LoaderData;

  const products = selectedCategory.products;

  return (
    <div className="py-9">
      <div className="flex items-center justify-center ">
        <img
          src={`${BASE_URL}${selectedCategory.image}`}
          width={30}
          height={30}
          // className="stroke-blue-500 dark:stroke-gray-200"
          alt="thumbnail"
        />
        <p className="font-semibold text-center pl-3">
          {selectedCategory.name}
        </p>
      </div>
      <div className="flex-center flex-wrap my-6 gap-4">
        {categories.map((cat) => (
          <CategoryBtn key={cat.id} cat={cat} />
        ))}
      </div>

      <div className="flex-center flex-wrap my-6 gap-4">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div
            className="italic font-semibold text-xl text-red-500 text-center
            py-10"
          >
            Извините, товаров в данной категории не найдено.
          </div>
        )}
      </div>
    </div>
  );
}
