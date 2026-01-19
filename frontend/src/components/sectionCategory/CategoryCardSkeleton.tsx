import Skeleton from "react-loading-skeleton";

interface Props {
  cards: number;
}

const CategoryCardSkeleton = ({ cards }: Props) => {
  return Array(cards)
    .fill(0)
    .map((_, index) => (
      <div
        key={index}
        className="w-[160px] h-[90px] sm:w-[220px] sm:h-[120px] bg-card  
			flex flex-col items-center justify-center p-4 shadow-xl rounded-2xl
      dark:drop-shadow-[5px_5px_5px_rgba(255,255,255,0.25)]
			transition-transform duration-300 hover:scale-110 cursor-pointer"
      >
        {/* Category Icon */}
        <div className="mb-5">
          <Skeleton circle width={40} height={40} />
        </div>

        {/* Category Name */}

        <Skeleton height={20} containerClassName="w-[75%] flex-1" />
      </div>
    ));
};

export default CategoryCardSkeleton;
