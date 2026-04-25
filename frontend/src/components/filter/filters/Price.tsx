import { useEffect, useState } from "react";

import { Slider } from "@/components/ui/slider";
import { useDebounce } from "@/hooks/useDebounce.ts";

interface Props {
  maxPrice: number;
  minPrice: number;
  maxLimit: number;
  currentMinPrice: number | undefined;
  currentMaxPrice: number | undefined;
  handlePriceChange: (minValue: number, maxValue: number) => void;
}

const Price = ({ minPrice, maxPrice, handlePriceChange, maxLimit }: Props) => {
  console.log("🚀 ~ Price ~ maxLimit:", maxLimit);
  // const maxLimit = 2000;
  const [localRange, setLocalRange] = useState([
    minPrice || 0,
    maxPrice || maxLimit,
  ]);

  const handleSliderChange = (values: number[]) => {
    setLocalRange(values);
    // Здесь же в будущем вызовем функцию обновления URL
  };

  const debouncedRange = useDebounce(localRange, 500);
  useEffect(() => {
    // Вызываем навигацию только когда дебаунс обновился
    handlePriceChange(debouncedRange[0], debouncedRange[1]);
  }, [debouncedRange]); // Зависимость от отложенного значения

  return (
    <>
      <div className="font-semibold my-2">Price</div>
      <div className="flex items-center">
        {localRange[0]} ₽ — {localRange[1]} ₽{" "}
        {localRange[1] == maxLimit && <span className="text-2xl ml-1">+</span>}
      </div>
      <div
        className="my-5"
        onPointerDown={(e) => e.stopPropagation()}
        // Останавливает жест Drawer-а
      >
        <Slider
          value={localRange}
          min={0}
          max={maxLimit}
          step={10}
          onValueChange={handleSliderChange} // Обновляет стейт при движении
          className="w-full"
        />
      </div>
    </>
  );
};

export default Price;
