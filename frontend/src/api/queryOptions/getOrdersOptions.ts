import { ORDER_GET_URL } from "@/api/endpoints.js";
import api from "@/api/api.js";
import { queryOptions } from "@tanstack/react-query";
import { type Order } from "@/lib/types.ts";

const getOrdersOptions = (email: string) => {
  return queryOptions({
    queryKey: ["userOrders", email],
    queryFn: () => getOrdersAction(email),
  });
};

const getOrdersAction = async (email: string): Promise<Order[] | null> => {
  if (email) {
    // --------------- Fetching delay ----------------------
    // await new Promise((resolve) => setTimeout(resolve, 4000));
    // -----------------------------------------------------
    // ВАРИАНТ-1 ASYNC AXIOS
    const response = await api.get(`${ORDER_GET_URL}${email}`);
    console.log("🚀 ~ getOrdersAction ~ response:", response);
    return response.data;
    // -----------------------------------------------------
    // ВАРИАНТ-1 AXIOS
    // return api
    //   .get(`${ORDER_GET_URL}${email}`)
    //   .then((response) => response?.data);

    // ВАРИАНТ-2 ASYNC Fetch
    // const response = await fetch(`${ORDER_GET_URL}${email}`);
    // return response.json();
    // -----------------------------------------------------
    // ВАРИАНТ-4 Fetch
    // return fetch(`${ORDER_GET_URL}${email}`)
    //   .then((response) => response.json())
    //   .then((data) => data);
  } else {
    return null;
  }
};

export default getOrdersOptions;
