import Modal from "@/components/uiComponents/Modal";
import RatingProgressBar from "@/components/productDetail/RatingProgressBar";
import ReviewForm from "@/components/productDetail/ReviewForm";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils.ts";
import { Link } from "@tanstack/react-router";
import { type ProductInDetails, type Review } from "@/lib/types.ts";
import { useUser } from "@/store/UserContext.tsx";
import { useState } from "react";
import { useI18nContext } from "@/i18n/i18n-react";

type Props = {
  product: ProductInDetails;
  isAuthorized: boolean;
  reviews: Review[];
};

// Функция склонения русских слов
const getRussianPlural = (
  count: number,
  one: string,
  few: string,
  many: string,
) => {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod100 >= 11 && mod100 <= 19) return many;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
};

const CustomerReviews = ({ product, isAuthorized, reviews }: Props) => {
  const { LL, locale } = useI18nContext();

  const avgRating = product.rating?.average_rating ?? 0;

  const reviewCount = product.rating?.total_reviews ?? 0;

  const starRating = Math.floor(avgRating);

  const stars: number[] = [1, 2, 3, 4, 5];

  const poor_rating = product.poor_review;
  const fair_rating = product.fair_review;
  const good_rating = product.good_review;
  const very_good_rating = product.very_good_review;
  const excellent_rating = product.excellent_review;

  const [isReviewFormOpen, setIsReviewFormOpen] = useState<boolean>(false);

  const { user } = useUser();

  const userAlreadyHaveReview = reviews.some(
    (review) => review.user.email === user?.email,
  );

  // Вычисляем правильное слово на основе текущего активного языка сайта
  let reviewWord = "";
  if (locale === "ru") {
    // Для русского: "из 1 отзыва", "из 3 отзывов", "из 5 отзывов"
    reviewWord = getRussianPlural(reviewCount, "отзыва", "отзывов", "отзывов");
  } else {
    // Для английского: "of 1 review", "of 5 reviews"
    reviewWord = reviewCount === 1 ? "review" : "reviews";
  }

  return (
    <>
      <div className="mx-auto">
        <h3 className="font-semibold text-xl text-center my-6 text-primaryDark">
          {LL.productSection.reviews()}
          {/* Customer Reviews */}
        </h3>
        <div
          className="w-full flex py-6 gap-6 
        flex-wrap items-center justify-between max-lg:justify-center"
        >
          {/* Rating display box */}
          <div
            className="w-[250px] h-[250px] bg-card rounded-lg px-4 py-6 
          flex flex-col gap-3 items-center justify-center shadow-lg"
          >
            <h1 className="text-5xl font-bold text-primaryDark">
              {avgRating.toFixed(1)}
            </h1>
            <small className="text-primaryDark text-sm">
              {LL.productSection.reviewsCount({
                count: reviewCount,
                reviewWord: reviewWord,
              })}

              {/* of {reviewCount} {reviewCount < 2 ? "review" : "reviews"} */}
            </small>
            <div className="flex gap-2">
              {stars.map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "w-5 h-5 cursor-pointer",
                    star <= starRating ? "fill-black" : "fill-gray-100",
                  )}
                />
              ))}
            </div>
          </div>
          {/* ------------------------------------------------------- */}

          {/* Rating progress bar */}
          <div className="flex flex-col gap-6 w-[700px] max-md:w-full">
            <RatingProgressBar
              rating={`${LL.productSection.excellent()}`}
              numRating={excellent_rating}
            />
            <RatingProgressBar
              rating={`${LL.productSection.veryGood()}`}
              numRating={very_good_rating}
            />
            <RatingProgressBar
              rating={`${LL.productSection.good()}`}
              numRating={good_rating}
            />
            <RatingProgressBar
              rating={`${LL.productSection.fair()}`}
              numRating={fair_rating}
            />
            <RatingProgressBar
              rating={`${LL.productSection.poor()}`}
              numRating={poor_rating}
            />
          </div>
          {/* ------------------------------------------------------- */}
        </div>

        {/* Review modal form */}
        <div className="flex justify-center items-center w-full mb-5">
          {isAuthorized ? (
            <Modal
              userAlreadyHaveReview={userAlreadyHaveReview}
              isModalOpen={isReviewFormOpen}
              setIsModalOpen={setIsReviewFormOpen}
            >
              <ReviewForm
                product={product}
                setIsReviewFormOpen={setIsReviewFormOpen}
              />
            </Modal>
          ) : (
            <Link to="/login" className="nav-btn">
              Login to add a review
            </Link>
          )}
        </div>
        {/* ------------------------------------------------------- */}
      </div>
    </>
  );
};

export default CustomerReviews;
