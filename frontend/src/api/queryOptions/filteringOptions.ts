import api, { BASE_URL } from "@/api/api";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";

interface Filters {
  shape?: string;
  search?: string;
  brand?: string;
  min_price?: string;
  max_price?: string;
  color?: string;
}

const filteringOptions = (
  shape: string,
  brand: string,
  min_price: string,
  max_price: string,
  color: string,
  search: string,
) => {
  return queryOptions({
    queryKey: [
      "products",
      { shape, brand, min_price, max_price, color, search },
    ],
    queryFn: () =>
      fetchProducts({
        shape,
        brand,
        min_price,
        max_price,
        color,
        search,
      }),
    placeholderData: keepPreviousData,
  });
};

export default filteringOptions;

const fetchProducts = async (options: Filters) => {
  try {
    const response = await api.get(`${BASE_URL}/api/filtering`, {
      params: {
        search: options.search || undefined, // Django получит ?search=...
        shape: options.shape || undefined, // и ?shape=...
        brand: options.brand || undefined, // и ?brand=...
        min_price: options.min_price || undefined,
        max_price: options.max_price || undefined,
        color: options.color || undefined,
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
