import { ADDRESS_GET_URL } from "@/api/endpoints.js";
import api from "@/api/api.js";
import { queryOptions } from "@tanstack/react-query";
import { type Address } from "@/lib/types.ts";

const getAddressOptions = (email: string) => {
  return queryOptions({
    queryKey: ["userAddress", email],
    queryFn: () => getAddressAction(email),
  });
};

const getAddressAction = async (email: string): Promise<Address | null> => {
  if (email) {
    // --------------- Fetching delay ----------------------
    // await new Promise((resolve) => setTimeout(resolve, 4000));
    // -----------------------------------------------------
    const response = await api.get(`${ADDRESS_GET_URL}${email}`);

    // console.log("🚀 ~ getAddressAction ~ response:", response);

    return response.data;
  } else {
    return null;
  }
};

export default getAddressOptions;
