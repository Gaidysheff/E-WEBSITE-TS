import FilteredResult from "@/components/filter/FilteredResult.tsx";
import { Spinner } from "@/components/ui/spinner";
import { createLazyFileRoute } from "@tanstack/react-router";
import filteringOptions from "@/api/queryOptions/filteringOptions.ts";
import { useQuery } from "@tanstack/react-query";

export const Route = createLazyFileRoute("/_filter/products")({
  component: RouteComponent,
});

function RouteComponent() {
  const { shape, brand, min_price, max_price, search } = Route.useSearch();

  const { data, isFetching } = useQuery(
    filteringOptions(shape, brand, min_price, max_price, search),
  );
  console.log("🚀 ~ RouteComponent ~ data:", data);

  return (
    <div>
      {isFetching && <Spinner className="size-30 text-red-500 mx-auto" />}
      <FilteredResult />
    </div>
  );
}
