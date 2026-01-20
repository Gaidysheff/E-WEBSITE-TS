import Skeleton from "react-loading-skeleton";

interface Props {
  cards: number;
}

const ProductCardSkeleton = ({ cards }: Props) => {
  return Array(cards)
    .fill(0)
    .map((_, index) => (
      <div
        key={index}
        className="w-[280px] rounded-lg bg-card flex flex-col items-center gap-4 
      shadow-2xl dark:drop-shadow-[10px_10px_10px_rgba(255,255,255,0.35)]
      px-5 py-6 transition-all duration-300 hover:shadow-xl hover:scale-105 
      cursor-pointer grayscale hover:grayscale-0"
      >
        {/* Product Image */}
        {/* <Skeleton width={100} height={150} /> */}

        <div
          className="w-[80%] h-40 mb-4 flex justify-center items-center
            bg-gray-300 animate-pulse"
        >
          <svg
            className="w-10 h-10 text-gray-200 dark:text-gray-600 animate-bounce"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 18"
          >
            <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
          </svg>
        </div>

        {/* Product Name */}
        <Skeleton height={20} containerClassName="w-[75%] flex-1" />

        {/* Product Price */}
        <Skeleton height={20} containerClassName="w-[25%] flex-1" />
      </div>
    ));
};

export default ProductCardSkeleton;
