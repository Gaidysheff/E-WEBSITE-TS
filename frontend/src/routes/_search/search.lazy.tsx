import { createLazyFileRoute } from "@tanstack/react-router";
import ProductCard from "@/components/sectionProduct/ProductCard.tsx";
import { type Product } from "@/lib/types.ts";

interface LoaderData {
  searchedProducts: Product[];
}

export const Route = createLazyFileRoute("/_search/search")({
  component: SearchComponent,
});

function SearchComponent() {
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
