import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { useEffect, useState } from "react";

import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce.ts";

// import { getRussianPlural } from "@/lib/utilities";

interface Props {
  currentSearch: string | undefined;
  handleSearchChange: (value: string) => void;
  onClose?: () => void;
  resultsCount: number;
}

const Searching = ({
  resultsCount,
  currentSearch,
  handleSearchChange,
  onClose,
}: Props) => {
  // Инициализируем локальный текст значением из URL (один раз при монтировании)
  const [lookupText, setLookupText] = useState(currentSearch || "");

  const debouncedLookupText = useDebounce(lookupText, 500) as string;

  // const searchParams = useSearch({
  //   strict: false,
  // }) as ProductUrlQuery;

  // TanStack Query НЕ будет делать второй запрос в сеть.
  // Он просто мгновенно возьмет данные из кеша, потому что ключи
  // (shape, search и т.д.) совпадут!
  // const { data: products } = useQuery(filteringOptions(searchParams));

  // const resultsCount = products?.count ?? 0; // Теперь берем общее число из count

  useEffect(() => {
    // Не отправляем пустую строку, если в URL и так ничего нет
    if (debouncedLookupText !== currentSearch) {
      handleSearchChange(debouncedLookupText || "");
    }
  }, [debouncedLookupText]);

  // Функция обработки нажатия клавиш
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      // 1. Принудительно вызываем поиск без ожидания дебаунса (опционально)
      handleSearchChange(lookupText);
      // 2. Закрываем Drawer
      if (onClose) onClose();
    }
  };

  return (
    <>
      <div className="font-semibold my-2">Search</div>
      <div>
        <InputGroup className="my-2" onPointerDown={(e) => e.stopPropagation()}>
          <InputGroupInput
            placeholder="Search..."
            value={lookupText} // Делаем инпут контролируемым
            onChange={(e) => setLookupText(e.target.value)}
            onKeyDown={handleKeyDown} // Навешиваем слушатель
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupText>
              {resultsCount} {/* {getRussianPlural(resultsCount)} */}
              {resultsCount == 1 ? <p>result</p> : <p>results</p>}
            </InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </>
  );
};

export default Searching;
