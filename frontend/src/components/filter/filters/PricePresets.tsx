import { cn } from "@/lib/utils.ts";
import { type PricePreset } from "@/lib/types.ts";
import { useCurrency } from "@/store/CurrencyContext";

interface Props {
  handlePriceChange: (minValue: number, maxValue: number) => void;
  maxLimit: number;
  presets: PricePreset[];
  setLocalRange: React.Dispatch<React.SetStateAction<number[]>>;
  localRange: number[];
}

const PricePresets = ({
  handlePriceChange,
  maxLimit,
  presets,
  setLocalRange,
  localRange,
}: Props) => {
  const { getPresetLabel } = useCurrency();

  return (
    <div className="flex flex-col gap-2 mt-4">
      {presets?.map((preset) => {
        const pMin = Number(preset.min_price) || 0;
        const pMax = Number(preset.max_price) || maxLimit;

        // ПРОВЕРКА АКТИВНОСТИ: Светится, если ползунки слайдера точно на границах пресета
        const isActive = localRange[0] === pMin && localRange[1] === pMax;

        // Если pMax равен максимальному лимиту каталога, передаем null,
        // чтобы функция красиво написала "от $ 50" (или "from $ 50")
        const isMaxLimit = pMax === maxLimit;
        const labelText = getPresetLabel(pMin, isMaxLimit ? null : pMax);

        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => {
              // 🌟 ДАННЫЕ ОСТАЮТСЯ В РУБЛЯХ ДЛЯ ЛОГИКИ И СЛАЙДЕРА:
              setLocalRange([pMin, pMax]); // Передаем массив из двух чисел
              handlePriceChange(pMin, pMax); // Отправляем два числа в запрос к Django
            }}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
              isActive
                ? "bg-myMainColor text-white border-myMainColor shadow-sm scale-105"
                : "bg-gray-50 text-gray-600 border-gray-200 hover:border-myMainColor/50",
            )}
          >
            {/* 🌟 ВЫВОДИМ КРАСИВЫЙ МУЛЬТИВАЛЮТНЫЙ ТЕКСТ: */}
            {labelText}

            {/* {preset.label} */}
          </button>
        );
      })}
    </div>
  );
};

export default PricePresets;
