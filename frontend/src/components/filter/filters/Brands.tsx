import { ChevronDown, ChevronUp } from "lucide-react";
import { Field, FieldLabel } from "@/components/ui/field";
import { useMemo, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils.ts";

interface Props {
  options: { id: number; name: string }[];
  currentBrands: string | undefined;
  handleBrandChange: (value: number[]) => void;
}

const Brands = ({ handleBrandChange, options, currentBrands }: Props) => {
  // Инициализируем массив из строки URL: "4,6" -> [4, 6]
  const selectedBrands = useMemo(
    () => (currentBrands ? currentBrands.split(",").map(Number) : []),
    [currentBrands],
  );

  const handleToggle = (brandId: number) => {
    const nextBrands = selectedBrands.includes(brandId)
      ? selectedBrands.filter((id) => id !== brandId)
      : [...selectedBrands, brandId];

    // Сразу вызываем функцию родителя, которая сделает navigate
    handleBrandChange(nextBrands);
  };

  const [isExpanded, setIsExpanded] = useState(false);

  // 1. Сортируем и группируем бренды по первой букве
  const groupedBrands = useMemo(() => {
    if (!options) return {}; // Если данных нет, возвращаем пустой объект

    const groups: Record<string, typeof options> = {};
    // Сортируем по алфавиту
    const sorted = [...options].sort((a, b) => a.name.localeCompare(b.name));

    sorted.forEach((brand) => {
      const char = brand.name[0].toUpperCase(); // Берем первую букву
      if (!groups[char]) groups[char] = [];
      groups[char].push(brand);
    });
    return groups;
  }, [options]);

  return (
    <>
      <div className="font-semibold my-2 italic text-myMainColor">Brands</div>
      <div
        className={cn(
          "space-y-4 scroll-behavior:smooth",
          isExpanded ? "max-h-[300px] overflow-y-auto no-scrollbar pr-2" : "",
        )}
      >
        {isExpanded
          ? // Если развернуто — показываем группы с буквами
            Object.entries(groupedBrands).map(([char, items]) => (
              <div key={char}>
                <div
                  className="sticky top-0 bg-white z-10 font-bold
                  text-myMainColor border-b mb-1"
                >
                  {char}
                </div>
                {items.map((opt) => (
                  <Field key={opt.id} orientation="horizontal" className="py-1">
                    <Checkbox
                      id={`brand-${opt.id}`}
                      checked={selectedBrands.includes(opt.id)}
                      onCheckedChange={() => handleToggle(opt.id)}
                    />
                    <FieldLabel htmlFor={`brand-${opt.id}`}>
                      {opt.name}
                    </FieldLabel>
                  </Field>
                ))}
              </div>
            ))
          : // Если свернуто — просто первые 5 брендов без букв
            options?.slice(0, 5).map((opt) => (
              <Field key={opt.id} orientation="horizontal" className="py-1">
                <Checkbox
                  id={`brand-simple-${opt.id}`}
                  checked={selectedBrands.includes(opt.id)}
                  onCheckedChange={() => handleToggle(opt.id)}
                />
                <FieldLabel htmlFor={`brand-simple-${opt.id}`}>
                  {opt.name}
                </FieldLabel>
              </Field>
            ))}
      </div>

      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-1 text-xs text-gray-500 mt-2 
        hover:text-myMainColor"
      >
        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {isExpanded
          ? "Show less"
          : `Show more (${(options?.length || 0) - 5} more)`}
      </button>
    </>
  );
};

export default Brands;
