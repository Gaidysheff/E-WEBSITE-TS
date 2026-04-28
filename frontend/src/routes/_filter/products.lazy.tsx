import FilteredResult from "@/components/filter/FilteredResult.tsx";
import { Spinner } from "@/components/ui/spinner";
import { createLazyFileRoute } from "@tanstack/react-router";
import filteringOptions from "@/api/queryOptions/filteringOptions.ts";
import { useQuery } from "@tanstack/react-query";
import {
  type Product,
  type ProductUrlSearch,
  type ProductSearch,
} from "@/lib/types.ts";

export const Route = createLazyFileRoute("/_filter/products")({
  component: RouteComponent,
});

function RouteComponent() {
  const { shape, brand, min_price, max_price, color, search } =
    Route.useSearch() as ProductUrlSearch;

  const { data, isFetching } = useQuery(
    filteringOptions(shape, brand, min_price, max_price, color, search),
  );

  const filteredResults = data as Product[];

  // // 1. Типизируем параметры поиска (они приходят из схемы в products.tsx)
  // const searchParams = Route.useSearch() as ProductUrlSearch;

  // // 2. Типизируем useQuery.
  // // Первый тип <Product[]> — это то, что вернет queryFn.
  // // Второй <Error> — тип ошибки.
  // const { data: filteredResults = [], isFetching } = useQuery<Product[], Error>(
  //   filteringOptions(shape, brand, min_price, max_price, color, search),
  // );

  console.log("🚀 ~ RouteComponent ~ data:", data);

  return (
    <div>
      {isFetching && <Spinner className="size-30 text-red-500 mx-auto" />}
      <FilteredResult
        filteredResults={filteredResults}
        isFetching={isFetching}
      />
    </div>
  );
}
