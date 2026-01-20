import Skeleton from "react-loading-skeleton";

interface Props {
  cards: number;
}

const CategoryBtnSkeleton = ({ cards }: Props) => {
  return Array(cards)
    .fill(0)
    .map((_, index) => (
      <div key={index} className="cat-btn cat-btn-passive">
        {/* Icon Container */}
        <div
          className="w-[40px] h-[40px] rounded-full overflow-hidden flex
        items-center justify-center shadow-xl icon-container-round"
        >
          <Skeleton circle width={30} height={30} />
        </div>

        {/* Category Name */}
        <Skeleton height={20} containerClassName="w-[50%] flex-1" />
      </div>
    ));
};

export default CategoryBtnSkeleton;
