import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate, useSearch } from "@tanstack/react-router";

interface Props {
  totalPages: number;
  currentPage: number;
}

const PageBreak = ({ totalPages, currentPage }: Props) => {
  const navigate = useNavigate();
  // Подключаем хук с указанием маршрута, чтобы TS подхватил типы

  const search = useSearch({ from: "/$lang/_mainLayout/_filter/products" });
  // const search = useSearch({ from: "/_mainLayout/_filter/products" });

  const pageSize = search.page_size;

  const handlePageChange = (newPage: number) => {
    navigate({ search: { ...search, page: newPage } });
  };

  const handlePageSizeChange = (newSize: string) => {
    navigate({ search: { ...search, page: 1, page_size: Number(newSize) } });
  };

  // --- Функция генерации умных ссылок ---
  const renderPageLinks = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      // Логика: всегда показывать первую, последнюю и по одной вокруг текущей
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              className="cursor-pointer"
              isActive={i === currentPage}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      }
      // Вставляем троеточие, если между текущей и краями есть разрыв
      else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push(
          <PaginationItem key={`ellipsis-${i}`}>
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }
    }
    return pages;
  };

  return (
    <div className="mx-auto flex flex-col items-center gap-4 my-8">
      {/* Селект выбора количества (Units per page) */}
      <div className="flex items-center gap-2">
        <span className="text-sm">Units per page:</span>
        <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[10, 25, 50, 100].map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Сама пагинация */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className="cursor-pointer"
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            />
          </PaginationItem>

          {/* ВСТАВЛЯЕМ УМНУЮ ФУНКЦИЮ */}
          {renderPageLinks()}

          {/* Пример простой отрисовки страниц */}
          {/* {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <PaginationItem key={p}>
              <PaginationLink
                className="cursor-pointer"
                isActive={p === currentPage}
                onClick={() => handlePageChange(p)}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))} */}

          <PaginationItem>
            <PaginationNext
              className="cursor-pointer"
              onClick={() =>
                handlePageChange(Math.min(totalPages, currentPage + 1))
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PageBreak;
