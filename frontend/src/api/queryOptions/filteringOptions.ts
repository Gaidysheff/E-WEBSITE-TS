import api, { BASE_URL } from "@/api/api";
import { type ProductSearch } from "@/lib/types";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";

const filteringOptions = (
  shape: string,
  brand: string,
  minPrice: number,
  maxPrice: number,
  color: string,
  search: string,
) => {
  return queryOptions({
    queryKey: ["products", { shape, brand, minPrice, maxPrice, color, search }],
    queryFn: () =>
      fetchProducts({
        shape,
        brand,
        minPrice,
        maxPrice,
        color,
        search,
      }),
    placeholderData: keepPreviousData,
  });
};

export default filteringOptions;

const fetchProducts = async (options: ProductSearch) => {
  try {
    const response = await api.get(`${BASE_URL}/api/filtering`, {
      params: {
        shape: options.shape || undefined, // и ?shape=...
        brand: options.brand || undefined, // и ?brand=...
        min_price: options.minPrice || undefined,
        max_price: options.maxPrice || undefined,
        color: options.color || undefined,
        search: options.search || undefined, // Django получит ?search=...
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
