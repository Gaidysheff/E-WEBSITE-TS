import { PenIcon, Star, TrashIcon } from "lucide-react";
import { cn, timeAgo } from "@/lib/utils.js";
// import Image from "@/assets/images/shared/profile_pic.jpg";
import { BASE_URL } from "@/api/api.ts";

import { type Review, type UserLoggedIn } from "@/lib/types.ts";

type Props = {
  review: Review;
  user: UserLoggedIn | undefined;
};

const ReviewCard = ({ review, user }: Props) => {
  const starArray = [1, 2, 3, 4, 5];

  return (
    <div
      className="w-full bg-card shadow-lg px-6 py-6 rounded-lg flex flex-col
      gap-4"
    >
      {/* Action buttons for editing and deleting the review */}
      <div className="flex justify-between items-center">
        {user?.email == review.user.email ? (
          <span className="flex gap-4">
            <>
              {/* Trash button to delete review */}

              <button
                type="button"
                className="bg-primaryLight p-2 rounded-md cursor-pointer
              transition-all hover:bg-gray-300"
              >
                <TrashIcon className="size-5 text-primaryDark" />
              </button>

              {/* Pen button to edit review */}

              <button
                type="button"
                className="bg-primaryLight p-2 rounded-md cursor-pointer
              transition-all hover:bg-gray-300"
              >
                <PenIcon className="size-5 text-primaryDark" />
              </button>
            </>
          </span>
        ) : (
          <span></span>
        )}

        {/* Information showing when the review was edited */}
        <span className="text-sm text-primary">
          {review.created == review.updated ? (
            <small className="block">published...</small>
          ) : (
            <small className="block">edited...</small>
          )}
          <small>{timeAgo(review.updated)}</small>
        </span>
      </div>

      {/* Reviewer's profile and review content */}
      <div className="flex gap-4 items-center">
        {/* Profile picture */}
        <div
          className="w-[50px] h-[50px] rounded-full relative overflow-hidden
          border-2 border-gray-200"
        >
          <img
            src={`${BASE_URL}${review.user.image}`}
            // src={review.user.image ? `${BASE_URL}${review.user.image}` : Image}
            alt="profile_pic"
            className="object-cover rounded-full"
            // fill="true"
          />
        </div>

        {/* Review content including name, rating, and review text */}
        <div className="flex flex-col flex-1">
          <p className="font-semibold text-sm xsm:text-lg text-primaryDark">
            {review.user.first_name || review.user.last_name
              ? `${review.user.first_name} ${review.user.last_name}`
              : `${review.user.email.split("@")[0]}`}
          </p>

          <div className="flex gap-1 mt-2">
            {starArray.map((star) => (
              <Star
                key={star}
                className={cn(
                  "size-4 xsm:size-5 cursor-pointer",
                  star <= review.rating ? "fill-black" : "",
                )}
              />
            ))}
          </div>

          {/* Review text */}
          <small
            className="text-primaryDark text-justify leading-6 mt-4
          text-xs xsm:text-sm"
          >
            {review.review}
          </small>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
