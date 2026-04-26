import { cn } from "@/lib/utils.ts";
import { useMemo } from "react";

interface Props {
  options: { id: number; name: string; color_code: string }[];
  currentColors: string | undefined; // Из URL: "1,3,5"
  handleColorChange: (value: number[]) => void;
}

const Color = ({ options, currentColors, handleColorChange }: Props) => {
  console.log("🚀 ~ Color ~ options:", options);
  // const selectedColors = useMemo(
  //   () => (currentColors ? currentColors.split(",").map(Number) : []),
  //   [currentColors],
  // );

  // 1. Вычисляем массив прямо здесь.
  // Как только currentColors (из URL) или options (из API) изменятся,
  // React сам перезапустит эту функцию и перерисует кнопки.
  const selectedColors = currentColors
    ? currentColors.split(",").map(Number)
    : [];

  const handleToggle = (id: number) => {
    const next = selectedColors.includes(id)
      ? selectedColors.filter((c) => c !== id)
      : [...selectedColors, id];

    // Сразу вызываем функцию родителя, которая сделает navigate
    handleColorChange(next);
  };

  // 2. Если данных еще нет, возвращаем скелетон или null
  if (!options || options.length === 0) {
    return (
      <div className="flex gap-2 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="w-8 h-8 rounded-full bg-gray-200" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="font-semibold my-2">Colors</div>
      <div className="flex flex-wrap gap-3 my-4 isolation: isolate">
        {options.map((color) => (
          <button
            type="button"
            key={color.id}
            id={`filter-color-${color.id}`} // Уникальный префикс
            title={color.name}
            onClick={() => handleToggle(color.id)}
            className={cn(
              "relative w-8 h-8 rounded-full border-2 transition-all hover:scale-110 shadow-sm",
              selectedColors.includes(color.id)
                ? "border-myMainColor ring-2 ring-myMainColor/20 ring-offset-2 scale-110"
                : "border-gray-200",
            )}
            // style={{ backgroundColor: color.color_code }} // Красим квадрат цветом из БД
            style={{
              backgroundColor: color.color_code.startsWith("#")
                ? color.color_code
                : `#${color.color_code}`,
            }}
          >
            {/* Галочка внутри, если цвет выбран */}
            {selectedColors.includes(color.id) && (
              <span
                className="absolute inset-0 flex items-center justify-center
                text-white text-xs drop-shadow-md"
              >
                ✓
              </span>
            )}
          </button>
        ))}
      </div>
    </>
  );
};

export default Color;
