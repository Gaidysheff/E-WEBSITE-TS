import { ADDRESS_GET_URL } from "@/api/endpoints.js";
import api from "@/api/api.js";
import { queryOptions } from "@tanstack/react-query";

const getAddressOptions = (email) => {
  return queryOptions({
    queryKey: ["userAddress", email],
    queryFn: () => getAddressAction(email),
  });
};

const getAddressAction = async (email) => {
  if (email) {
    // --------------- Fetching delay ----------------------
    // await new Promise((resolve) => setTimeout(resolve, 4000));
    // -----------------------------------------------------
    const response = await api.get(`${ADDRESS_GET_URL}${email}`);
    return response.data;
  } else {
    return null;
  }
};

export default getAddressOptions;
