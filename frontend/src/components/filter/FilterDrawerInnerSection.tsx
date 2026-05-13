import Brands from "./filters/Brands.tsx";
import Color from "./filters/Color.tsx";
import Price from "./filters/Price.tsx";
import RatingFilter from "./filters/RatingFilter.tsx";
import Searching from "./filters/Searching.tsx";
import { Separator } from "@/components/ui/separator";
import Shape from "./filters/Shape.tsx";
import api from "@/api/api.ts";
import { useQuery } from "@tanstack/react-query";
import filteringOptions from "@/api/queryOptions/filteringOptions.ts";
import { useSearch } from "@tanstack/react-router";
import { type ProductUrlQuery } from "@/lib/types.ts";
import SkeletonFilters from "./SkeletonFilters.tsx";

interface Props {
  handleShapeChange: (value: string) => void;
  handleBrandChange: (value: number[]) => void;
  handlePriceChange: (minValue: number, maxValue: number) => void;
  handleColorChange: (value: number[]) => void;
  handleSearchChange: (value: string) => void;
  handleRatingChange: (rating: number | undefined) => void;
  currentShape: string | undefined;
  currentBrands: string | undefined; // Строка из URL: "4,6" - 1 бренд или несколько в 1 строке
  currentColors: string | undefined; // Из URL: "1,3,5"
  currentSearch: string | undefined;
  currentRating: number | undefined;
  onClose?: () => void;
}

const FilterDrawerInnerSection = ({
  handleSearchChange,
  handleShapeChange,
  handleBrandChange,
  handlePriceChange,
  handleColorChange,
  handleRatingChange,
  currentShape,
  currentBrands,
  currentColors,
  currentSearch,
  currentRating,
  onClose,
}: Props) => {
  const { data: metadata, isPending } = useQuery({
    queryKey: ["filter-metadata"],
    queryFn: () => api.get("/api/get_filter_metadata/").then((res) => res.data),
    staleTime: 1000 * 60 * 60, //Данные фильтров меняются редко, кешируем на час
  });

  // console.log("🚀 ~ FilterDrawerInnerSection ~ METAdata:", metadata);

  const maxLimit = metadata?.max_price ?? 2000;

  const searchParams = useSearch({ strict: false }) as ProductUrlQuery;

  const { data } = useQuery(filteringOptions(searchParams));

  if (isPending) return <SkeletonFilters />;

  return (
    <>
      {/* Передаем конкретные данные в каждый фильтр */}
      <Shape
        handleShapeChange={handleShapeChange}
        currentShape={currentShape}
        options={metadata?.shapes}
      />
      <Separator className="h-[1px] my-5" />
      <Brands
        options={metadata?.brands}
        currentBrands={currentBrands}
        handleBrandChange={handleBrandChange}
      />
      <Separator className="h-[1px] my-5" />

      <Price
        maxLimit={maxLimit}
        minPrice={metadata?.min_price}
        maxPrice={metadata?.max_price}
        handlePriceChange={handlePriceChange}
        presets={metadata?.price_presets}
      />

      <Separator className="h-[1px] my-5" />

      <Color
        options={metadata?.colors}
        currentColors={currentColors}
        handleColorChange={handleColorChange}
      />

      <Separator className="h-[1px] my-5" />

      <RatingFilter
        currentRating={currentRating}
        handleRatingChange={handleRatingChange}
        stats={data?.rating_stats}
      />

      <Separator className="h-[1px] my-5" />

      <Searching
        currentSearch={currentSearch}
        handleSearchChange={handleSearchChange}
        onClose={onClose}
        resultsCount={data?.count ?? 0}
      />
    </>
  );
};

export default FilterDrawerInnerSection;
