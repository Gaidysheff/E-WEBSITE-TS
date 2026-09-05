import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { type NewsCategory } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { getFilterLabelsAction } from "@/api/actions";
import { useI18nContext } from "@/i18n/i18n-react";

import { type Dispatch, type SetStateAction } from "react";

type Props = {
  selectedCategory: string;
  setSelectedCategory: Dispatch<SetStateAction<string>>;
  // setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
};

const FilterLabels = ({ selectedCategory, setSelectedCategory }: Props) => {
  const { LL, locale } = useI18nContext();

  const { data: categories } = useQuery<NewsCategory[]>({
    queryKey: ["news-categories", locale],
    queryFn: getFilterLabelsAction,
    staleTime: 1000 * 60 * 60,
    //Данные фильтров меняются редко, кешируем на час
  });

  return (
    <Select
      onValueChange={(value: string) => {
        setSelectedCategory(value);
      }}
      value={selectedCategory || ""}
    >
      <SelectTrigger
        className="w-[220px] focus:border-myMainColor/50
          text-xl text-myMainColor"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="border-2 border-myMainColor/50">
        <SelectGroup>
          <SelectItem
            value="all"
            className="focus:bg-myMainColor/50 focus:font-bold"
          >
            {LL.newsApplication.allCategories()}
            {/* All categories */}
          </SelectItem>
          {/* Используем защитную проверку Array.isArray */}
          {Array.isArray(categories) &&
            categories.map((cat) => {
              // КРИТИЧЕСКИ ВАЖНО: добавить ключевое слово return,
              // иначе SelectItem не отрендерится!
              return (
                <SelectItem
                  key={cat.id}
                  value={cat.slug}
                  className="focus:bg-myMainColor/50 focus:font-bold"
                >
                  {cat.name}
                  {/* 3. Отображаем нужное поле динамически на основе текущей локали */}
                  {/* {locale === "ru" ? cat.name_ru : cat.name_en} */}
                </SelectItem>
              );
            })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default FilterLabels;
