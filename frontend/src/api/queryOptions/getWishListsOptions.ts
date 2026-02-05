import { WISHLISTS_GET_URL } from "@/api/endpoints.js";
import api from "@/api/api.js";
import { queryOptions } from "@tanstack/react-query";
import { type WishList } from "@/lib/types.ts";

const getWishListsOptions = (email: string) => {
  return queryOptions({
    queryKey: ["userWishLists", email],
    queryFn: () => getWishListsAction(email),
  });
};
const getWishListsAction = async (
  email: string,
): Promise<WishList[] | null> => {
  if (email) {
    // --------------- Fetching delay ----------------------
    // await new Promise((resolve) => setTimeout(resolve, 4000));
    // -----------------------------------------------------
    const response = await api.get(`${WISHLISTS_GET_URL}${email}`);

    console.log("🚀 ~ getWishListsAction ~ response:", response);
    return response.data;
  } else {
    return null;
  }
};

export default getWishListsOptions;
