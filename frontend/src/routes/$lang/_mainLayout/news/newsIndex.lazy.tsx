import { getFilterLabelsAction } from "@/api/actions";
import { BASE_URL } from "@/api/api";
import filteringOptions from "@/api/queryOptions/newsFilteringOptions";
import { AppLink as Link } from "@/components/appLink/AppLink";
import PageBreak from "@/components/pagination/PageBreak.tsx";
import { Spinner } from "@/components/ui/spinner";
import { useAppNavigate } from "@/hooks/useAppNavigate.ts";
import { useI18nContext } from "@/i18n/i18n-react";
import { type NewsCategory } from "@/lib/types";
import { type PostUrlQuery } from "@/lib/types.ts";
import { cn } from "@/lib/utils.ts";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/$lang/_mainLayout/news/newsIndex")({
  component: NewsList,
});

function NewsList() {
  const { LL, locale } = useI18nContext();
  // 1. Типизируем параметры поиска (они приходят из схемы в newsIndex.tsx)
  const searchParams = Route.useSearch() as PostUrlQuery;
  const navigate = useAppNavigate();

  // const [activeFilter, setActiveFilter] = useState<string>("all");

  // Считываем активную категорию прямо из URL. Если там пусто, значит выбрано "all"
  const currentCategory = searchParams.category || "all";

  // 1. Категории из бэкенда.
  // Передаем locale в queryKey, чтобы названия (name_ru / name_en) менялись на лету
  const { data: categories = [] } = useQuery<NewsCategory[]>({
    queryKey: ["news-categories", locale],
    queryFn: getFilterLabelsAction,
    staleTime: 1000 * 60 * 60,
    //Данные фильтров меняются редко, кешируем на час
  });

  // const { data: posts = [], isPending } = useQuery<Post[]>({
  //   queryKey: ["posts", locale],
  //   queryFn: getFilteredNewsAction,
  //   staleTime: 1000 * 60 * 60,
  //   //Данные фильтров меняются редко, кешируем на час
  // });

  // 2. Посты из бэкенда (уже пагинированные и отфильтрованные на сервере)
  const { data: posts, isPending } = useQuery(filteringOptions(searchParams));

  const totalPages = posts?.total_pages ?? 1;
  const currentPage = posts?.current_page ?? 1;

  // Фильтруем новости на лету
  // const filteredNews = posts?.results.filter((item) => {
  //   if (activeFilter === "all") return true;
  //   return item.category?.slug === activeFilter;
  // });

  // Берем посты из results (Django пагинация)
  const newsList = posts?.results || [];

  // --- Функция переключения категорий ---
  const handleCategoryChange = (newCategory: string) => {
    navigate({
      search: {
        ...searchParams,
        // Если выбрали "all", убираем параметр из URL, иначе ставим slug категории
        category: newCategory === "all" ? undefined : newCategory,
        page: 1, // КРИТИЧЕСКИ ВАЖНО: сбрасываем на 1 страницу при любой смене фильтра!
      },
    });
  };

  const handlePageChange = (newPage: number) => {
    navigate({ search: { ...searchParams, page: newPage } });
  };

  const handlePageSizeChange = (newSize: string) => {
    navigate({
      search: { ...searchParams, page: 1, page_size: Number(newSize) },
    });
  };

  if (isPending)
    return <Spinner className="size-30 text-myMainColor mx-auto" />;

  return (
    <section className="mt-10 mb-30">
      <div className="container">
        {/* -------------------- Heading -------------------- */}
        <div className="mb-8">
          <p className="text-2xl">
            {LL.newsApplication.subtitle()}
            {/* our news and events */}
          </p>
          <h2 className="text-5xl">
            {LL.newsApplication.title()}
            {/* Useful Articles */}
          </h2>
        </div>
        {/* ==================== Buttons ==================== */}
        {/* ------------------- Button All ------------------ */}
        <div className="flex flex-wrap items-center justify-center mb-8 gap-3 text-base">
          <button
            className={cn(
              "w-35 border border-primary rounded-sm p-1 px-2 overflow-auto whitespace-nowrap hover:scale-110 cursor-pointer transition-all",
              // activeFilter === "all"
              currentCategory === "all"
                ? "bg-primary text-white"
                : "bg-transparent text-primary",
            )}
            type="button"
            // onClick={() => setActiveFilter("all")
            // Вместо стейта вызываем нашу функцию для URL
            onClick={() => handleCategoryChange("all")}
          >
            All
          </button>
          {/* ---------------- Button from DB --------------- */}
          {Array.isArray(categories) &&
            categories.map((btn) => {
              // Вычисляем true/false для конкретной кнопки
              // const isActive = activeFilter === btn.slug;

              // Сверяем с текущей категорией из URL
              const isActive = currentCategory === btn.slug;

              return (
                <button
                  key={btn.id}
                  className={cn(
                    "min-w-35 border border-primary rounded-sm p-1 px-2 overflow-auto whitespace-nowrap hover:scale-110 cursor-pointer transition-all",
                    isActive
                      ? "bg-primary text-white"
                      : "bg-transparent text-primary",
                  )}
                  type="button"
                  // Передаем slug категории в URL
                  onClick={() => handleCategoryChange(btn.slug)}
                  // onClick={() => setActiveFilter(btn.slug)}
                >
                  {btn.name}
                  {/* {locale === "ru" ? btn.name_ru : btn.name_en}  */}
                </button>
              );
            })}
        </div>
        {/* ----------------- List of Posts ----------------- */}
        <div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-5
          lg:gap-6 xl:gap-10"
        >
          {/* Используем защитную проверку Array.isArray */}
          {/* {Array.isArray(filteredNews) &&
            filteredNews.map((post) => ( */}
          {Array.isArray(newsList) &&
            newsList.map((post) => (
              <div
                key={post.id}
                className="overflow-hidden border border-primary rounded-lg"
              >
                <div className="duration-300 ease-in">
                  <div className=" flex flex-col justify-between">
                    <div>
                      <img
                        className="h-full w-full"
                        src={`${BASE_URL}${post.image}`}
                        alt={`image for Post Category ${post.category.name}`}
                      />
                    </div>
                    <div className="flex flex-col justify-between p-4">
                      <div
                        className={cn(
                          "mr-auto bg-myMainColor text-white font-semibold px-2 leading-8 rounded-sm mb-3",
                          // post.category?.slug === activeFilter
                          //   ? "hidden"
                          //   : "",
                          { hidden: post.category?.slug === currentCategory },
                          // { hidden: post.category?.slug === activeFilter },
                          // Если true -> добавит 'hidden', если false -> ничего
                        )}
                      >
                        {post.category.name}
                      </div>
                      <h3 className="h-14 line-clamp-2 font-bold text-lg mb-2">
                        {post.title}
                      </h3>
                      <p className="line-clamp-4 text-primary mb-6">
                        {post.text}
                      </p>
                      <Link
                        to={`/news/${post.slug}`}
                        className="text-myMainColor font-semibold ml-auto
                      hover:scale-105 duration-500 cursor-pointer"
                      >
                        {LL.newsApplication.readArticle()}
                        {/* Read the article */}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="my-5">
          <PageBreak
            totalPages={totalPages}
            currentPage={currentPage}
            pageSize={searchParams.page_size || 12}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            newsPage
          />
        </div>
      </div>
    </section>
  );
}
