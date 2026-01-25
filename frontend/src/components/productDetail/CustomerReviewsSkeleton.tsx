import Skeleton from "react-loading-skeleton";

const CustomerReviewsSkeleton = () => {
  return (
    <>
      <div className="mx-auto">
        <div className="flex justify-center my-6">
          <Skeleton width={300} height={40} />
        </div>
        <div
          className="w-full flex py-6 gap-6 
        flex-wrap items-center justify-between max-lg:justify-center"
        >
          {/* Rating display box */}
          <div
            className="w-[250px] h-[250px] bg-card rounded-lg px-4 py-6 
          flex flex-col gap-3 items-center justify-center shadow-lg"
          >
            <span className="flex flex-col items-center">
              <Skeleton height={50} width={75} />
              <Skeleton height={15} width={90} className="my-3" />
              <Skeleton height={20} width={110} />
            </span>
          </div>
          {/* ------------------------------------------------------- */}

          {/* Rating progress bar */}
          <div className="flex flex-col gap-6 w-[700px] max-md:w-full">
            <div className="flex items-center gap-5 sm:gap-8 md:gap-10 w-full">
              <div className="w-[10%] md:w-[100px]">
                <Skeleton height={10} count={5} className="my-2 sm:my-5" />
              </div>

              <div className="flex-1">
                <Skeleton height={10} count={5} className="my-2 sm:my-5" />
              </div>

              <div className="w-[5%] md:w-[40px]">
                <Skeleton height={10} count={5} className="my-2 sm:my-5" />
              </div>
            </div>
          </div>
          {/* ------------------------------------------------------- */}
        </div>

        {/* Review modal form */}
        <div className="w-full xsm:w-[300px] mb-5 mx-auto">
          <Skeleton height={50} containerClassName="flex-1" />
        </div>
        {/* ------------------------------------------------------- */}
      </div>
    </>
  );
};

export default CustomerReviewsSkeleton;
