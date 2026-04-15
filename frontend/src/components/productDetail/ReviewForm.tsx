import Button from "../uiComponents/Button";
import { Star } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { type ProductInDetails, type Review } from "@/lib/types.ts";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useUser } from "@/store/UserContext.tsx";
import { createReviewAction, updateReviewAction } from "@/api/actions.ts";
import { type FormEvent } from "react";
import { toast } from "react-toastify";
import { useRouter } from "@tanstack/react-router";

type HandleStars = {
  rating: number;
  review: string;
};

interface Props {
  product: ProductInDetails;
  review?: Review;
  updateReviewForm?: boolean;
  setIsReviewFormOpen: Dispatch<SetStateAction<boolean>>;
}

const ReviewForm = ({
  product,
  review,
  updateReviewForm,
  setIsReviewFormOpen,
}: Props) => {
  const ratings = [
    { rating: 1, review: "Poor" },
    { rating: 2, review: "Fair" },
    { rating: 3, review: "Good" },
    { rating: 4, review: "Very Good" },
    { rating: 5, review: "Excellent" },
  ];

  const router = useRouter();

  const [hoverRating, setHoverRating] = useState(0);
  const [hoverReview, setHoverReview] = useState("");

  const [clickedRating, setClickedRating] = useState(0);
  const [clickedReview, setClickedReview] = useState("");

  const { id, slug } = product;
  const [customerReview, setCustomerReview] = useState("");
  const { user } = useUser();

  const [reviewBtnLoader, setReviewBtnLoader] = useState<boolean>(false);

  useEffect(() => {
    if (updateReviewForm && !!review) {
      const { rating, review: reviewMessage } = review;

      setClickedRating(rating);
      setCustomerReview(reviewMessage);

      const ratingTag = ratings.find((r) => r.rating === rating);
      setClickedReview(ratingTag ? ratingTag.review : "");
    }
  }, [updateReviewForm]);

  // ===================== Add Review =========================

  const handleCreateReview = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setReviewBtnLoader(true);
    setIsReviewFormOpen(true);

    if (!id || !user?.email || !clickedRating || !customerReview || !slug) {
      toast.error("All fields are required");
      throw new Error("All fields are required");
    }

    const formData = new FormData();
    formData.set("product_id", String(id));
    formData.set("review", customerReview);
    formData.set("rating", String(clickedRating));
    formData.set("email", String(user?.email));

    try {
      await createReviewAction(formData);
      toast.success("Review added successfully!");
      await router.invalidate(); // МАГИЯ: заставляет лоадеры текущей страницы перекачать данные
    } catch (error: any) {
      toast.error("Something went wrong");
      throw error;
    } finally {
      setIsReviewFormOpen(false);
      setReviewBtnLoader(false);
    }
  };

  // ===================== Update Review =========================

  const handleUpdateReview = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setReviewBtnLoader(true);
    setIsReviewFormOpen(true);

    const formData = new FormData();
    formData.set("review", customerReview);
    formData.set("rating", String(clickedRating));
    formData.set("review_id", review ? String(review.id) : "");

    try {
      await updateReviewAction(formData);
      toast.success("Review updated successfully!");
      await router.invalidate();
    } catch (error: any) {
      toast.error("Something went wrong");
      throw error;
    } finally {
      setReviewBtnLoader(false);
      setIsReviewFormOpen(false);
    }
  };

  // ==========================================================
  const handleStarClick = ({ rating, review }: HandleStars) => {
    setClickedRating(rating);
    setClickedReview(review);
  };

  const handleHoverIn = ({ rating, review }: HandleStars) => {
    setHoverRating(rating);
    setHoverReview(review);
  };

  const handleHoverOut = () => {
    setHoverRating(0);
    setHoverReview("");
  };

  return (
    <div className="w-full mx-auto bg-white rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
        Rate and review this product
      </h3>

      <div className="flex items-center justify-center gap-2 mb-4">
        {ratings.map(({ rating, review }) => (
          <Star
            key={rating}
            onPointerEnter={() => handleHoverIn({ rating, review })}
            onPointerLeave={handleHoverOut}
            onClick={() => handleStarClick({ rating, review })}
            className={cn(
              "w-7 h-7 cursor-pointer text-black hover:text-black transition",
              rating <= hoverRating ||
                (rating <= clickedRating && hoverRating < 1)
                ? "fill-black"
                : "",
            )}
          />
        ))}
      </div>

      <p className="text-center text-gray-600 text-sm">
        {hoverReview || clickedReview || "Review Score"}
      </p>
      {/* Review Form */}
      <form
        className="flex flex-col gap-4 mt-4"
        onSubmit={updateReviewForm ? handleUpdateReview : handleCreateReview}
      >
        <Textarea
          name="content"
          value={customerReview}
          onChange={(e) => setCustomerReview(e.target.value)}
          className="border border-gray-300 focus:border-blue-500 focus:ring
          focus:ring-blue-300 rounded-lg p-3 w-full resize-none"
          placeholder="Write your review..."
          required
        />

        <Button
          disabled={
            clickedRating < 1 ||
            (customerReview && customerReview.trim()).length == 0 ||
            reviewBtnLoader
          }
          handleClick={
            updateReviewForm
              ? () => handleUpdateReview
              : () => handleCreateReview
          }
          className="bg-black text-white w-full py-2 rounded-lg 
          hover:bg-gray-900 transition
          disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {/* {reviewBtnLoader ? "Adding Review ..." : "Add Review"} */}

          {updateReviewForm
            ? reviewBtnLoader
              ? "Updating Review ..."
              : "Update Review"
            : reviewBtnLoader
              ? "Adding Review ..."
              : "Add Review"}
        </Button>
      </form>
    </div>
  );
};

export default ReviewForm;
