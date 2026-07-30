import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import { USER_ORDERS_URL } from "@/api/endpoints.ts";
import privateApi from "@/api/api";

export const userOrdersOptions = queryOptions({
  queryKey: ["user-orders"],
  queryFn: async () => {
    const response = await privateApi.get(USER_ORDERS_URL);
    // const response = await api.get(`${BASE_URL}/api/core_app/user_orders_list`);
    return response.data;
  },
  placeholderData: keepPreviousData,
});
