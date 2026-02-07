import {
  CATEGORY_DETAIL_PAGE_URL,
  CATEGORY_LIST_URL,
} from "@/api/endpoints.ts";

import CategoryPageSkeleton from "@/components/category/CategoryPageSkeleton.tsx";
import Error from "@/components/error/Error.tsx";
import Error404notFound from "@/components/error/Error404notFound.tsx";

import api from "@/api/api.ts";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "react-toastify";
import { type Category, type CategoryWithProducts } from "@/lib/types.ts";

export const Route = createFileRoute("/categories/$categoryId")({
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
