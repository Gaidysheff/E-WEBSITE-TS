import { type Post } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { getFilteredNewsAction } from "@/api/actions";
import { BASE_URL } from "@/api/api";
import { motion, AnimatePresence } from "framer-motion";
import SubscribeCard from "./SubscribeCard";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils.ts";
import { useI18nContext } from "@/i18n/i18n-react";
import { AppLink as Link } from "@/components/appLink/AppLink";

type Props = {
  selectedCategory: string;
};

const FilterResult = ({ selectedCategory }: Props) => {
  const { LL, locale } = useI18nContext();

  const { data: posts = [], isPending } = useQuery<Post[]>({
    // Включаем selectedCategory в ключ кэша,
    // чтобы триггерить перезапрос при смене фильтра
    queryKey: ["posts-preview", selectedCategory, locale],
    queryFn: () => getFilteredNewsAction(selectedCategory, 5),
    staleTime: 1000 * 60 * 60,
    //Данные фильтров меняются редко, кешируем на час
  });

  // Фильтруем новости на лету
  // const filteredNews = posts.filter((item) => {
  //   if (selectedCategory === "all") return true;
  //   return item.category?.slug === selectedCategory;
  // });

  if (isPending)
    return <Spinner className="size-30 text-myMainColor mx-auto" />;

  return (
    <>
      {/* AnimatePresence нужна для плавной анимации исчезновения (exit) */}
      <motion.div
        layout
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-5
        lg:gap-6 xl:gap-10"
      >
        <AnimatePresence mode="popLayout">
          {/* {filteredNews.slice(0, 5).map((post) => ( */}
          {posts.map((post) => (
            <motion.div
              key={post.id}
              layout // <-- МАГИЯ: заставляет карточки плавно
              // перелетать на новые места!
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
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
                        // post.category?.slug === selectedCategory
                        //   ? "hidden"
                        //   : "",
                        { hidden: post.category?.slug === selectedCategory },
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

                      {/* {`${post.text.slice(0, 100)} ...`} */}
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
            </motion.div>
          ))}
        </AnimatePresence>

        <SubscribeCard />
      </motion.div>
    </>
  );
};

export default FilterResult;
