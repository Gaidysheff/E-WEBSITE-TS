import CategoryCard from "./CategoryCard";
import CategoryCardSkeleton from "./CategoryCardSkeleton.tsx";
import Skeleton from "react-loading-skeleton";
import { useCategory } from "@/store/CategoryContext.tsx";

const CategorySection = () => {
  const { categories, isLoading, error } = useCategory();

  if (error) {
    console.log(
      "!!! ВНИМАНИЕ. Возникла ОШИБКА при загрузки списка категорий!!!",
    );
    console.log(error);
  }

  return (
    <section className="mx-auto my-20">
      <h2 className="my-9 text-center text-xl font-bold text-primaryDark">
        {isLoading ? (
          <Skeleton width={300} height={40} />
        ) : (
          "Browse By Category"
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
            Извините, возникла непредвиденная ОШИБКА сервера при загрузки списка
            категорий!!!
          </div>
        )}
      </div>
    </section>
  );
};

export default CategorySection;
