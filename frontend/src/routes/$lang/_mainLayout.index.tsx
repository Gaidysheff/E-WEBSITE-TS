import { PRODUCTS_IN_CAROUSEL_URL } from "@/api/endpoints.ts";
import api from "@/api/api.ts";
import axios from "axios";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$lang/_mainLayout/")({
  // loader: async () => {
  //   // ---------- get Products for Carousel ----------
  //   try {
  //     const response = await api.get(`${PRODUCTS_IN_CAROUSEL_URL}`);
  //     return {
  //       productsForCarousel: response?.data,
  //     };
  //   } catch (error: any) {
  //     throw error;
  //   }
  // },
  loader: () => {
    axios
      .get("https://onrender.com")
      .then((res) => console.log(res.data))
      .catch((err) => console.error(err));
  },
});
