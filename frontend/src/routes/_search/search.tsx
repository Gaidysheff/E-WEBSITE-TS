import { PRODUCT_SEARCH_URL } from "@/api/endpoints.ts";
import api from "@/api/api.ts";
import { createFileRoute } from "@tanstack/react-router";
import ProductCard from "@/components/sectionProduct/ProductCard.tsx";
import { type Product } from "@/lib/types.ts";
import { toast } from "react-toastify";
import Error from "@/components/error/Error.tsx";
import SearchSkeleton from "@/components/search/SearchSkeleton.tsx";

interface LoaderData {
  searchedProducts: Product[];
}

export const Route = createFileRoute("/_search/search")({
  component: RouteComponent,

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
    if (response.status != 200) {
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

function RouteComponent() {
  const { searchedProducts } = Route.useLoaderData() as LoaderData;

  const { query } = Route.useSearch();

  return (
    <section className="w-full px-6 py-16 text-center">
      <p className="font-thin text-center text-xl">
        You searched for - <span className="font-semibold">{query}</span>
      </p>
      <div className="flex-center flex-wrap my-9 gap-4">
        {searchedProducts.length > 0 ? (
          searchedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="font-thin text-center text-xl">
            There is no product matching your search input yet.
          </p>
        )}
      </div>
    </section>
  );
}
