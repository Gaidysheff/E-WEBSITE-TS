import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { useMemo, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";

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

  return (
    <>
      <div className="font-semibold my-2">Brands</div>
      <FieldSet>
        {options?.map((opt) => (
          <FieldGroup key={opt.id}>
            <Field orientation="horizontal" className="py-1">
              <Checkbox
                id={`brand-${opt.id}`}
                checked={selectedBrands.includes(opt.id)}
                onCheckedChange={() => handleToggle(opt.id)}
              />
              <FieldLabel
                htmlFor={`brand-${opt.id}`}
                className="cursor-pointer"
              >
                {opt.name}
              </FieldLabel>
            </Field>
          </FieldGroup>
        ))}
      </FieldSet>
    </>
  );
};

export default Brands;
