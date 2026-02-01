import { PRODUCTS_IN_CAROUSEL_URL } from "@/api/endpoints.ts";
import api from "@/api/api.ts";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  loader: async () => {
    // ---------- get Products for Carousel ----------
    const response = await api.get(`${PRODUCTS_IN_CAROUSEL_URL}`);
    if (response?.status != 200) {
      throw Error();
    }
    // ------------------------------------------------

    return {
      productsForCarousel: response?.data,
    };
  },

  // component: RouteComponent,
});

// function RouteComponent() {
//   return <div>Hello "/"!</div>;
// }
