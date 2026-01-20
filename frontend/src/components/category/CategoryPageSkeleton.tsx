import CategoryBtnSkeleton from "./CategoryBtnSkeleton.tsx";
import ProductCardSkeleton from "./../sectionProduct/ProductCardSkeleton.tsx";
import Skeleton from "react-loading-skeleton";

interface Props {}

const CategoryPageSkeleton = (props: Props) => {
  return (
    <div className="py-9">
      <div className="mx-auto flex items-center justify-center w-[25%]">
        <Skeleton circle width={40} height={40} />
        <Skeleton height={30} containerClassName="pl-3 w-[25%] flex-1" />
      </div>

      <div className="flex-center flex-wrap my-6 gap-4">
        <CategoryBtnSkeleton cards={6} />
      </div>

      <div className="flex-center flex-wrap my-6 gap-4">
        <ProductCardSkeleton cards={4} />
      </div>
    </div>
  );
};

export default CategoryPageSkeleton;
