import Error from "@/components/error/Error.tsx";
import { PRODUCT_SEARCH_URL } from "@/api/endpoints.ts";
import SearchSkeleton from "@/components/search/SearchSkeleton.tsx";
import api from "@/api/api.ts";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "react-toastify";

export const Route = createFileRoute("/_search/search")({
  validateSearch: (search) => {
    return {
      query: (search.query as string) || "",
    };
  },

  loaderDeps: ({ search: { query } }) => ({ query }),

  loader: async ({ deps: { query } }) => {
    // ---------- Loading Delay ----------
    // await new Promise((resolve) => setTimeout(resolve, 2000));

    // ---------- Product Search ----------
    const response = await api.get(`${PRODUCT_SEARCH_URL}${query}`);
    if (response?.status != 200) {
      throw Error();
    }
    // ------------------------------------

    return {
      searchedProducts: response.data,
    };
  },

  pendingComponent: () => <SearchSkeleton />,

  errorComponent: () => {
    toast.error("An unknown error occured");
    return <Error />;
  },
  // errorComponent: ({ error }) => <div>Error - error.message</div>,
});
