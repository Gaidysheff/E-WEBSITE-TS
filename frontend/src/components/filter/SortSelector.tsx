import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { type ProductUrlQuery } from "@/lib/types";

const SortSelector = () => {
  const navigate = useNavigate();
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
        <SelectItem value="-id">Сначала новые</SelectItem>
        <SelectItem value="price_asc">Цена: по возрастанию</SelectItem>
        <SelectItem value="price_desc">Цена: по убыванию</SelectItem>
        <SelectItem value="name_asc">Алфавит: А-Я</SelectItem>
        <SelectItem value="rating_desc">Рейтинг: по убыванию</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default SortSelector;
