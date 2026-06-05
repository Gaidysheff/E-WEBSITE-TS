import CategoryCard from "./CategoryCard";
import CategoryCardSkeleton from "./CategoryCardSkeleton.tsx";
import Skeleton from "react-loading-skeleton";
import Waves from "@/components/decor/Waves.tsx";
import { useCategory } from "@/store/CategoryContext.tsx";
import { useI18nContext } from "@/i18n/i18n-react";

const CategorySection = () => {
  const { LL } = useI18nContext();

  const { categories, isLoading, error } = useCategory();

  if (error) {
    console.log(
      "!!! ВНИМАНИЕ. Возникла ОШИБКА при загрузки списка категорий!!!",
    );
    console.log(error);
  }

  return (
    <section>
      {/* <div className="h-20 bg-gradient-to-t from-myMainColor/10 to-myMainColor/0"></div> */}
      <div className="bg-myMainColor/10">
        <div className="container">
          <div className="mx-auto pb-20">
            <h2 className="py-9 text-center text-xl font-bold text-primaryDark">
              {isLoading ? (
                <Skeleton width={300} height={40} />
              ) : (
                // "Browse By Category"
                `${LL.categorySection.title()}`
              )}
            </h2>

            {/* Content */}
            <div className="flex justify-center flex-wrap gap-8">
              {isLoading && <CategoryCardSkeleton cards={6} />}

              {categories.map((cat) => (
                <CategoryCard key={cat.id} cat={cat} />
              ))}

              {!!error && (
                <div className="italic text-xl text-red-500 text-center">
                  {/* Извините, возникла непредвиденная ОШИБКА сервера при загрузки
                  списка категорий!!! */}
                  {LL.categorySection.error()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* <div className="h-20 bg-gradient-to-b from-myMainColor/10 to-myMainColor/0"></div> */}
    </section>
  );
};

export default CategorySection;
