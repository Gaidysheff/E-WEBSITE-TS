import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppNavigate } from "@/hooks/useAppNavigate.ts";
import { type ProductUrlQuery } from "@/lib/types";
import { useSearch } from "@tanstack/react-router";
import { useI18nContext } from "@/i18n/i18n-react";

const SortSelector = () => {
  const { LL } = useI18nContext();
  const navigate = useAppNavigate();
  const search = useSearch({ from: "/$lang/_mainLayout/_filter/products" });
  // const search = useSearch({ from: "/_mainLayout/_filter/products" });

  return (
    <Select
      value={search.ordering || "-id"}
      onValueChange={(value: string) =>
        navigate({
          to: ".", // Остаемся на текущем роуте
          search: (prev: ProductUrlQuery) => ({
            ...prev,
            ordering: value,
            page: 1,
          }),
        })
      }
    >
      <SelectTrigger className="w-[250px]">
        <SelectValue placeholder="Сортировка" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="-id">
          {LL.sorting.new()}
          {/* Сначала новые */}
        </SelectItem>
        <SelectItem value="price_asc">
          {LL.sorting.priceUp()}
          {/* Цена: по возрастанию */}
        </SelectItem>
        <SelectItem value="price_desc">
          {LL.sorting.priceDown()}
          {/* Цена: по убыванию */}
        </SelectItem>
        <SelectItem value="name_asc">
          {LL.sorting.alphabet()}
          {/* Алфавит: А-Я */}
        </SelectItem>
        <SelectItem value="rating_desc">
          {LL.sorting.rating()}
          {/* Рейтинг: по убыванию */}
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default SortSelector;
