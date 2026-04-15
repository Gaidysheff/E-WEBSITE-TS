import { Star } from "lucide-react";
import { cn, timeAgo } from "@/lib/utils.js";
import { BASE_URL } from "@/api/api.ts";
import Modal from "@/components/uiComponents/Modal.tsx";
import ReviewForm from "@/components/productDetail/ReviewForm.tsx";
import {
  type Review,
  type UserLoggedIn,
  type ProductInDetails,
} from "@/lib/types.ts";
import DeleteModal from "@/components/uiComponents/DeleteModal.tsx";
import { deleteReviewAction } from "@/api/actions.ts";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "@tanstack/react-router";

type Props = {
  review: Review;
  user: UserLoggedIn | undefined;
  product: ProductInDetails;
};

const ReviewCard = ({ review, user, product }: Props) => {
  const [isReviewFormOpen, setIsReviewFormOpen] = useState<boolean>(false);

  const starArray = [1, 2, 3, 4, 5];

  const router = useRouter();

  // ===================== Delete Review =========================

  const handleDeleteReview = async () => {
    const formData = new FormData();
    formData.set("review_id", String(review.id));

    try {
      await deleteReviewAction(formData);
      toast.warning("Review deleted successfully!");
      await router.invalidate();
    } catch (error: any) {
      toast.error("Something went wrong");
      throw error;
    }
  };

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

              <DeleteModal handleDeleteReview={handleDeleteReview} />

              {/* Pen button to edit review */}
              <Modal
                userAlreadyHaveReview={false}
                addressForm={false}
                updateReviewModal
                address={null}
                isModalOpen={isReviewFormOpen}
                setIsModalOpen={setIsReviewFormOpen}
              >
                <ReviewForm
                  updateReviewForm
                  review={review}
                  product={product}
                  setIsReviewFormOpen={setIsReviewFormOpen}
                />
              </Modal>
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
