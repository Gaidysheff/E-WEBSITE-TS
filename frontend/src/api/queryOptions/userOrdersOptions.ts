import api, { BASE_URL } from "@/api/api";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";

export const userOrdersOptions = queryOptions({
  queryKey: ["user-orders"],
  queryFn: async () => {
    const response = await api.get(`${BASE_URL}/api/user_orders_list`);
    return response.data;
  },
  placeholderData: keepPreviousData,
});
