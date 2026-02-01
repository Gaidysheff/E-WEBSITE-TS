import ProductCardSkeleton from "@/components/sectionProduct/ProductCardSkeleton.tsx";
import Skeleton from "react-loading-skeleton";

const SearchSkeleton = () => {
  return (
    <section className="w-full px-6 py-16 text-center">
      <div className="inline-flex items-center">
        <Skeleton height={20} width={200} />
        <span className="px-3"> - </span>
        <Skeleton height={25} width={50} />
      </div>
      <div className="flex-center flex-wrap my-9 gap-4">
        <ProductCardSkeleton cards={2} />
      </div>
    </section>
  );
};

export default SearchSkeleton;
