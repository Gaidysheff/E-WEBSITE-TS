import Skeleton from "react-loading-skeleton";

interface Props {
  cards: number;
}

const CartItem = ({ cards }: Props) => {
  return Array(cards)
    .fill(0)
    .map((_, index) => (
      <div
        key={index}
        className="flex items-center justify-between gap-2 lg:gap-4 xl:gap-6
          border border-primaryLight py-4 mb-6 w-full flex-wrap bg-card px-4
          rounded-lg shadow-xl"
      >
        <div
          className="flex items-center justify-between gap-2 lg:gap-4 xl:gap-6
          w-full flex-wrap"
        >
          {/* Line-1 */}
          <div className="flex items-center justify-between gap-6 lg:gap-4 xl:gap-6">
            {/* Product Image */}
            <div className="relative overflow-hidden w-[70px] h-[70px] rounded-lg">
              <div
                className=" h-full w-full flex justify-center items-center
              bg-gray-300 animate-pulse"
              >
                <svg
                  className="w-7 h-7 text-gray-200 dark:text-gray-600"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 18"
                >
                  <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                </svg>
              </div>
            </div>
            {/* Product Details - Name and Price */}
            <div className="flex-1 w-full">
              <Skeleton height={20} width={150} />
              <Skeleton height={10} width={50} />
            </div>
          </div>
          {/* Line-2 */}
          <div className="flex items-center md:justify-end gap-2 xsm:gap-6 max-sm:mx-auto">
            {/* Quantity Selector */}
            <div
              className="flex items-center justify-center gap-2 px-2 py-1
                rounded-md"
            >
              {/* Decrease Quantity Button */}
              <Skeleton height={30} width={30} />
              {/* Quantity Display */}
              <Skeleton height={40} width={50} />
              {/* Increase Quantity Button */}
              <Skeleton height={30} width={30} />
            </div>
            {/* Subtotal Price */}
            <Skeleton height={25} width={80} />
            {/* Remove Item Button */}
            <Skeleton height={30} width={30} />
          </div>
        </div>
        {/* Update Cart Button */}
        <div className="ml-auto">
          <Skeleton height={50} width={160} />
        </div>
      </div>
    ));
};

export default CartItem;
