import { PenIcon, Star, TrashIcon } from "lucide-react";

import Image from "@/assets/images/shared/profile_pic.jpg";

const ReviewCard = () => {
  const starArray = [1, 2, 3, 4, 5];

  return (
    <div
      className="w-full bg-card shadow-lg px-6 py-6 rounded-lg flex flex-col
      gap-4"
    >
      {/* Action buttons for editing and deleting the review */}
      <div className="flex justify-between items-center">
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

        {/* Information showing when the review was edited */}
        <span className="text-sm text-primary">
          <small className="block">edited...</small>

          <small>1 month age</small>
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
            src={Image}
            alt="profile_pic"
            className="object-cover rounded-full"
            // fill="true"
          />
        </div>

        {/* Review content including name, rating, and review text */}
        <div className="flex flex-col flex-1">
          <p className="font-semibold text-sm xsm:text-lg text-primaryDark">
            Ivan Ivanov
          </p>

          <div className="flex gap-1 mt-2">
            {starArray.map((star) => (
              <Star key={star} className="size-4 xsm:size-5 cursor-pointer" />
            ))}
          </div>

          {/* Review text */}
          <small
            className="text-primaryDark text-justify leading-6 mt-4
          text-xs xsm:text-sm"
          >
            Something about the product
          </small>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
