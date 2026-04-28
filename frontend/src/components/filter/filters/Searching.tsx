import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { useEffect, useState } from "react";
import { type ProductUrlSearch } from "@/lib/types.ts";
import { useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import filteringOptions from "@/api/queryOptions/filteringOptions.ts";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce.ts";

interface Props {
  currentSearch: string | undefined;
  handleSearchChange: (value: string) => void;
}

const Searching = ({ currentSearch, handleSearchChange }: Props) => {
  // Инициализируем локальный текст значением из URL (один раз при монтировании)
  const [lookupText, setLookupText] = useState(currentSearch || "");

  const debouncedLookupText = useDebounce(lookupText, 500) as string;

  useEffect(() => {
    // Не отправляем пустую строку, если в URL и так ничего нет
    if (debouncedLookupText !== currentSearch) {
      handleSearchChange(debouncedLookupText || "");
    }
  }, [debouncedLookupText]);

  // ============================================

  const { shape, brand, min_price, max_price, color, search } = useSearch({
    strict: false,
  }) as ProductUrlSearch;

  // TanStack Query НЕ будет делать второй запрос в сеть.
  // Он просто мгновенно возьмет данные из кеша, потому что ключи
  // (shape, search и т.д.) совпадут!
  const { data: products } = useQuery(
    filteringOptions(shape, brand, min_price, max_price, color, search),
  );

  const resultsCount = products?.length ?? 0;

  return (
    <>
      <div className="font-semibold my-2">Search</div>
      <div>
        <InputGroup className="my-2" onPointerDown={(e) => e.stopPropagation()}>
          <InputGroupInput
            placeholder="Search..."
            value={lookupText} // Делаем инпут контролируемым
            onChange={(e) => setLookupText(e.target.value)}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupText>
              {resultsCount}

              {/* {resultsCount == 1 ? (
                <p>результат</p>
              ) : resultsCount > 1 && resultsCount < 5 ? (
                <p>результата</p>
              ) : (
                <p>результатов</p>
              )} */}
              {resultsCount == 1 ? <p>result</p> : <p>results</p>}
            </InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </>
  );
};

export default Searching;
