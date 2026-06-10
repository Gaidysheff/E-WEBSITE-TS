import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useI18nContext } from "@/i18n/i18n-react";

interface Props {
  handleShapeChange: (value: string) => void;
  currentShape: string | undefined;
  options: { value: string; label: string }[];
}

const Shape = ({ handleShapeChange, currentShape, options }: Props) => {
  const { LL } = useI18nContext();

  return (
    <>
      <div className="font-semibold my-2">
        {LL.filter.shape()}
        {/* Shape */}
      </div>

      <Select onValueChange={handleShapeChange} value={currentShape || ""}>
        <SelectTrigger className="w-[180px] focus:border-myMainColor/50">
          <SelectValue placeholder={`${LL.filter.shapePlaceholder()}`} />
          {/* <SelectValue placeholder="show all shapes" /> */}
        </SelectTrigger>
        <SelectContent className="border-2 border-myMainColor/50">
          <SelectGroup>
            <SelectItem
              value="all"
              className="focus:bg-myMainColor/50 focus:font-bold"
            >
              {LL.filter.shapes()}
              {/* All shapes */}
            </SelectItem>

            {options?.map((opt) => {
              // Заставляем typesafe-i18n динамически прочитать ключ из словаря.
              // Используем приведение типа к ключевым словам (keyof), чтобы TS не ругался.
              const translatedLabel =
                LL.choices.shape[
                  opt.value as keyof typeof LL.choices.shape
                ]?.() || opt.label;
              return (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  className="focus:bg-myMainColor/50 focus:font-bold"
                >
                  {translatedLabel}
                  {/* {opt.label} */}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
};

export default Shape;
