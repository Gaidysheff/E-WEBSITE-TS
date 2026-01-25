import { ChevronsUpDown } from "lucide-react";
import Skeleton from "react-loading-skeleton";

const ReviewCardContainerSkeleton = () => {
  return (
    <div className="space-y-2 mb-30">
      <div className="flex items-center justify-between space-x-4 px-4">
        <Skeleton width={300} height={40} />
        <div>
          <div className="w-9 p-0 flex justify-center">
            <ChevronsUpDown className="w-4 h-4"></ChevronsUpDown>
          </div>
        </div>
      </div>
      {/* <ReviewCard
        key={reviews[0].id}
        review={reviews[0]}
        loggedInUser={loggedInUser}
      /> */}
      {/* =================== ReviewCard ========================== */}
      <div
        className="w-full bg-card shadow-lg px-6 py-6 rounded-lg
				flex flex-col gap-4"
      >
        {/* Action buttons for editing and deleting the review */}
        <div className="flex justify-between items-center">
          <span></span>

          {/* Information showing when the review was edited */}
          <div>
            <div className="my-[-10px]">
              <Skeleton height={8} width={70} />
            </div>
            <div className="my-[-10px]">
              <Skeleton height={8} width={70} />
            </div>
          </div>
        </div>

        {/* Reviewer's profile and review content */}
        <div className="flex gap-4 items-center">
          {/* Profile picture */}

          <Skeleton circle width={50} height={50} />

          {/* Review content including name, rating, and review text */}
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton height={30} width={200} />
            <Skeleton height={20} width={150} />

            {/* Review text */}
            <div className="flex-1 ">
              <Skeleton height={10} count={5} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCardContainerSkeleton;
