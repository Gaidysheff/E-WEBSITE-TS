import { useEffect, useState } from "react";
import { type PricePreset } from "@/lib/types.ts";
import PricePresets from "./PricePresets.tsx";
import { Slider } from "@/components/ui/slider";
import { useDebounce } from "@/hooks/useDebounce.ts";

interface Props {
  maxPrice: number;
  minPrice: number;
  maxLimit: number;
  handlePriceChange: (minValue: number, maxValue: number) => void;
  presets: PricePreset[];
}

const Price = ({
  minPrice,
  maxPrice,
  handlePriceChange,
  maxLimit,
  presets,
}: Props) => {
  // Локальный стейт слайдера
  const [localRange, setLocalRange] = useState<number[]>([
    minPrice ?? 0,
    maxPrice ?? maxLimit,
  ]);

  const handleSliderChange = (values: number[]) => {
    setLocalRange(values);
  };

  // СИНХРОНИЗАЦИЯ:
  // Если URL изменился (через пресеты), подтягиваем ползунки слайдера
  useEffect(() => {
    // Если в URL нет параметров, ставим границы по умолчанию из мета-данных
    setLocalRange([minPrice ?? 0, maxPrice ?? maxLimit]);
  }, [maxLimit, minPrice, maxPrice]);

  const debouncedRange = useDebounce(localRange, 500) as number[];

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
          // Используем key: когда maxLimit изменится, Slider перерисуется с нуля
          key={maxLimit}
          value={localRange}
          min={0}
          max={maxLimit}
          step={10}
          onValueChange={handleSliderChange} // Обновляет стейт при движении
          className="w-full"
        />

        {/* 2. Динамические Чипсы */}
        <PricePresets
          maxLimit={maxLimit}
          handlePriceChange={handlePriceChange}
          presets={presets}
          setLocalRange={setLocalRange}
          localRange={localRange}
        />
      </div>
    </>
  );
};

export default Price;
