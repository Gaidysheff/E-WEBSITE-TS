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
import { useNavigate, useSearch } from "@tanstack/react-router";
import { AppLink as Link } from "@/components/appLink/AppLink";

import { Button } from "@/components/ui/button";
import FilterDrawerInnerSection from "./FilterDrawerInnerSection.tsx";
import { TbFilterSearch } from "react-icons/tb";

import { type ProductSearch } from "@/lib/types";
import { useState } from "react";

const FilterDrawer = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  // Используем strict: false. Теперь не упадет на главной!
  const searchParams = useSearch({
    strict: false,
  }) as ProductSearch;

  const handleShapeChange = (newShape: string) => {
    navigate({
      to: ".",
      // to: "/products",
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
      to: ".",
      // to: "/products",
      search: (prev: any) => ({
        ...prev,
        // Если массив пуст — удаляем ключ из URL, иначе склеиваим через запятую
        brand: brandIds.length > 0 ? brandIds.join(",") : undefined,
      }),
      replace: true,
    });
  };

  const handlePriceChange = (minPrice: number, maxPrice: number) => {
    navigate({
      to: ".",
      // to: "/products",
      search: (prev: any) => ({
        ...prev,
        min_price: minPrice,
        max_price: maxPrice,
      }),
      replace: true,
    });
  };

  const handleColorChange = (colorIds: number[]) => {
    navigate({
      to: ".",
      // to: "/products",
      search: (prev: any) => ({
        ...prev,
        // Если массив пуст — удаляем ключ из URL, иначе склеиваим через запятую
        color: colorIds.length > 0 ? colorIds.join(",") : undefined,
      }),
      replace: true,
    });
  };

  const handleRatingChange = (rating: number | undefined) => {
    navigate({
      to: ".",
      // to: "/products",
      search: (prev: any) => ({
        ...prev,
        rating,
      }),
      replace: true,
    });
  };

  const handleSearchChange = (search: string) => {
    navigate({
      to: ".",
      // to: "/products",",
      search: (prev: any) => ({
        ...prev,
        search,
      }),
      replace: true,
    });
  };

  const handleReset = () => {
    navigate({
      to: ".",
      // to: "/products",
      search: {}, // Пустой объект удалит ВСЕ параметры из URL
      replace: true,
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Drawer open={isOpen} onOpenChange={setIsOpen} direction={"left"}>
        <DrawerTrigger asChild>
          {/* <Link to={"/products"}> */}
          <Link to={"/products"} onClick={() => setIsOpen(true)}>
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
              handleColorChange={handleColorChange}
              handleSearchChange={handleSearchChange}
              currentShape={searchParams.shape}
              currentBrands={searchParams.brand}
              currentColors={searchParams.color}
              currentSearch={searchParams.search}
              onClose={() => setIsOpen(false)}
              currentRating={searchParams.rating}
              handleRatingChange={handleRatingChange}
            />
          </div>
          <DrawerFooter>
            <div className="flex flex-col gap-2 pb-10">
              <Button onClick={handleReset}>Reset All Filters</Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default FilterDrawer;
