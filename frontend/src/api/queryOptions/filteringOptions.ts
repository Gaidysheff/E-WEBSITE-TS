import type {
  PaginatedResponse,
  Product,
  ProductSearch,
  ProductUrlQuery,
} from "@/lib/types";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import { FILTERING_URL } from "@/api/endpoints.ts";
import { publicApi } from "@/api/api";
import { useParams } from "@tanstack/react-router";

const filteringOptions = (options: ProductUrlQuery) => {
  const { lang } = useParams({ strict: false });
  const {
    shape,
    brand,
    min_price: minPrice,
    max_price: maxPrice,
    color,
    search,
    page,
    page_size: pageSize,
    ordering,
    rating,
  } = options;

  return queryOptions({
    queryKey: [
      "products",
      {
        shape,
        brand,
        minPrice,
        maxPrice,
        color,
        search,
        page,
        pageSize,
        ordering,
        rating,
      },
      lang,
    ],

    // Явно указываем тип возвращаемого значения в queryFn
    // queryFn: (): Promise<Product[]> =>
    queryFn: (): Promise<PaginatedResponse<Product>> =>
      fetchProducts({
        shape,
        brand,
        minPrice,
        maxPrice,
        color,
        search,
        page,
        pageSize,
        ordering,
        rating,
      }),

    placeholderData: keepPreviousData,
  });
};

export default filteringOptions;

const fetchProducts = async (options: ProductSearch) => {
  try {
    const response = await publicApi.get(FILTERING_URL, {
      // const response = await publicApi.get(`${BASE_URL}/api/core_app/filtering`, {
      params: {
        shape: options.shape || undefined, // и ?shape=...
        brand: options.brand || undefined, // и ?brand=...
        min_price: options.minPrice || undefined,
        max_price: options.maxPrice || undefined,
        color: options.color || undefined,
        search: options.search || undefined, // Django получит ?search=...
        page: options.page || undefined, // Django получит ?page=...
        page_size: options.pageSize || undefined,
        ordering: options.ordering || undefined,
        rating: options.rating || undefined,
      },
    });
    console.log("🚀 ~ fetchProducts ~ response:", response);

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};
