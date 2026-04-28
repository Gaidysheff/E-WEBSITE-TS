import Brands from "./filters/Brands.tsx";
import Color from "./filters/Color.tsx";
import Price from "./filters/Price.tsx";
import Searching from "./filters/Searching.tsx";
import { Separator } from "@/components/ui/separator";
import Shape from "./filters/Shape.tsx";
import api from "@/api/api.ts";
import { useQuery } from "@tanstack/react-query";

interface Props {
  handleShapeChange: (value: string) => void;
  handleBrandChange: (value: number[]) => void;
  handlePriceChange: (minValue: number, maxValue: number) => void;
  handleColorChange: (value: number[]) => void;
  handleSearchChange: (value: string) => void;
  currentShape: string | undefined;
  currentBrands: string | undefined; // Строка из URL: "4,6" - 1 бренд или несколько в 1 строке
  currentMinPrice: number | undefined;
  currentMaxPrice: number | undefined;
  currentColors: string | undefined; // Из URL: "1,3,5"
  currentSearch: string | undefined;
}

const FilterDrawerInnerSection = ({
  handleSearchChange,
  handleShapeChange,
  handleBrandChange,
  handlePriceChange,
  handleColorChange,
  currentShape,
  currentBrands,
  currentMinPrice,
  currentMaxPrice,
  currentColors,
  currentSearch,
}: Props) => {
  const { data: metadata, isLoading } = useQuery({
    queryKey: ["filter-metadata"],
    queryFn: () => api.get("/api/get_filter_metadata/").then((res) => res.data),
    staleTime: 1000 * 60 * 60, //Данные фильтров меняются редко, кешируем на час
  });

  const maxLimit = metadata?.max_price ?? 2000;

  // if (isLoading) return <FilterSkeleton />;

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
        currentMinPrice={currentMinPrice}
        currentMaxPrice={currentMaxPrice}
        handlePriceChange={handlePriceChange}
      />

      <Separator className="h-[1px] my-5" />

      <Color
        options={metadata?.colors}
        currentColors={currentColors}
        handleColorChange={handleColorChange}
      />

      <Separator className="h-[1px] my-5" />
      <Searching
        currentSearch={currentSearch}
        handleSearchChange={handleSearchChange}
      />
    </>
  );
};

export default FilterDrawerInnerSection;
