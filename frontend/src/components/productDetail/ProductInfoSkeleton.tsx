import Skeleton from "react-loading-skeleton";

const ProductInfoSkeleton = () => {
  return (
    <div
      className="py-10 md:pt-20 flex items-start flex-wrap md:grid 
    md:grid-cols-8 gap-6"
    >
      {/* Product Image */}
      <div
        className="bg-card md:col-span-3 relative overflow-hidden rounded-lg 
      max-md:mt-10 p-3 xsm:p-10 md:p-3 shadow-sm border border-gray-200
			flex justify-center w-full"
      >
        <div className="w-full object-cover rounded-lg mx-auto">
          <div
            className="h-40 sm:h-60 md:h-80 mb-4 flex justify-center items-center
            bg-gray-300 animate-pulse"
          >
            <svg
              className="w-20 h-20 text-gray-200 dark:text-gray-600"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 18"
            >
              <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="md:col-span-5 w-full max-md:mt-10">
        <div className="flex flex-col gap-3">
          <Skeleton height={35} containerClassName="w-[50%] flex-1" />
          <Skeleton height={30} containerClassName="w-[40%] flex-1" />
        </div>

        {/* Product Details */}
        <div className="mt-6 flex flex-col gap-3">
          <Skeleton height={25} width={60} />
          <Skeleton
            height={15}
            containerClassName="w-[100%] flex-1"
            count={8}
          />
        </div>

        {/* Buttons */}
        <div className="flex py-3 items-center gap-4 flex-wrap">
          <Skeleton height={45} containerClassName="w-[50%] flex-1" />
          <Skeleton height={45} containerClassName="w-[50%] flex-1" />
        </div>
      </div>
    </div>
  );
};

export default ProductInfoSkeleton;
