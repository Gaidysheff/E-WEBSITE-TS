import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import FilterDrawerInnerSection from "./FilterDrawerInnerSection.tsx";
import { TbFilterSearch } from "react-icons/tb";

interface Props {}

interface ProductSearch {
  shape?: string;
  search?: string;
  brand?: string;
  maxPrice?: number;
  minPrice?: number;
}

const FilterDrawer = (props: Props) => {
  const navigate = useNavigate();

  // const searchParams = useSearch({ from: "/_filter/products" });

  // 2. Используем strict: false. Теперь не упадет на главной!
  const searchParams = useSearch({
    strict: false,
  }) as ProductSearch;

  const handleShapeChange = (newShape: string) => {
    navigate({
      to: "/products",
      search: (prev: any) => ({
        ...prev,
        // Если выбрано "all", удаляем ключ из URL совсем
        shape: newShape === "all" ? undefined : newShape,
      }),
      replace: true, // чтобы не засорять историю кнопкой "назад"
    });
  };

  const handleBrandChange = (brandIds: number[]) => {
    navigate({
      to: "/products",
      search: (prev: any) => ({
        ...prev,
        // Если массив пуст — удаляем ключ из URL, иначе склеиваим через запятую
        brand: brandIds.length > 0 ? brandIds.join(",") : undefined,
      }),
      replace: true,
    });
  };

  const handlePriceChange = (minPrice: number, maxPrice: number) => {
    // const maxLimit = 3434;
    // const max_p = maxPrice === maxLimit ? undefined : maxPrice;
    navigate({
      to: "/products",
      search: (prev: any) => ({
        ...prev,
        min_price: minPrice,
        // max_price: max_p,
        max_price: maxPrice,
      }),
      replace: true,
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Drawer direction={"left"}>
        <DrawerTrigger asChild>
          <Link to={"/products"}>
            <TbFilterSearch
              size={40}
              className="text-primaryDark hover:text-primaryDark/50
              hover:scale-110 transition duration-300"
            />
          </Link>
        </DrawerTrigger>
        <DrawerContent
          className="data-[vaul-drawer-direction=bottom]:max-h-[50vh]
          data-[vaul-drawer-direction=top]:max-h-[50vh]"
        >
          <DrawerHeader>
            <DrawerTitle>Filtering Criteria</DrawerTitle>
            <DrawerDescription>
              Select the criteria needed for finding certain products.
            </DrawerDescription>
          </DrawerHeader>
          <div className="no-scrollbar overflow-y-auto px-4">
            <FilterDrawerInnerSection
              handleShapeChange={handleShapeChange}
              handleBrandChange={handleBrandChange}
              handlePriceChange={handlePriceChange}
              currentShape={searchParams.shape}
              currentBrands={searchParams.brand}
              currentMinPrice={searchParams.minPrice}
              currentMaxPrice={searchParams.maxPrice}
            />
          </div>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default FilterDrawer;
