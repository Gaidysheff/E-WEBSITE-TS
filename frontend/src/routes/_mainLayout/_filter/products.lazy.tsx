import filteringOptions from "@/api/queryOptions/filteringOptions.ts";
import FilteredResult from "@/components/filter/FilteredResult.tsx";
import { Spinner } from "@/components/ui/spinner";
import { type ProductUrlQuery } from "@/lib/types.ts";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_mainLayout/_filter/products")({
  component: RouteComponent,
});

function RouteComponent() {
  // 1. Типизируем параметры поиска (они приходят из схемы в products.tsx)
  const searchParams = Route.useSearch() as ProductUrlQuery;

  // const { data: filteredResults = [], isFetching } = useQuery(
  //   filteringOptions(searchParams),
  // );

  // Теперь useQuery будет возвращать объект с результатами и мета-данными

  const { data, isFetching } = useQuery(filteringOptions(searchParams));

  const totalPages = data?.total_pages ?? 1;
  const currentPage = data?.current_page ?? 1;

  // console.log("🚀 ~ RouteComponent ~ data:", data);

  return (
    <div className="container">
      {isFetching && <Spinner className="size-30 text-red-500 mx-auto" />}
      <FilteredResult
        filteredResults={data?.results}
        isFetching={isFetching}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </div>
  );
}
