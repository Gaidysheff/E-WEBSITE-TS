import {
  CATEGORY_DETAIL_PAGE_URL,
  CATEGORY_LIST_URL,
} from "@/api/endpoints.ts";

import { BASE_URL } from "@/api/api";
import CategoryBtn from "@/components/category/CategoryBtn";
import CategoryPageSkeleton from "@/components/category/CategoryPageSkeleton.tsx";
import Error from "@/components/error/Error.tsx";
import Error404notFound from "@/components/error/Error404notFound.tsx";
import ProductCard from "@/components/sectionProduct/ProductCard";
import api from "@/api/api.ts";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "react-toastify";
import {
  type Category,
  type Product,
  type CategoryWithProducts,
} from "@/lib/types.ts";

export const Route = createFileRoute("/categories/$categoryId")({
  component: CategoryPage,

  loader: async ({ params: { categoryId } }) => {
    // ---------- Loading Delay ----------
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    const responseCategory = await api.get<CategoryWithProducts>(
      `${CATEGORY_DETAIL_PAGE_URL}${categoryId}`,
    );

    const statusCodeResponseCategory =
      (responseCategory && responseCategory.status) || 0;

    const responseListOfCategories =
      await api.get<Category[]>(CATEGORY_LIST_URL);

    if (
      statusCodeResponseCategory !== 200 ||
      responseListOfCategories.status !== 200
    ) {
      throw Error();
    }

    return {
      selectedCategory: responseCategory.data,
      categories: responseListOfCategories.data,
    };
  },

  pendingComponent: () => <CategoryPageSkeleton />,

  errorComponent: () => {
    toast.error("Something went wrong");
    return <Error404notFound />;
  },
});

function CategoryPage() {
  const { selectedCategory, categories } = Route.useLoaderData();

  const products: Product[] = selectedCategory.products;
  const _categories: Category[] = categories;

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
        {_categories.map((cat) => (
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
