import Modal from "@/components/uiComponents/Modal";
import RatingProgressBar from "@/components/productDetail/RatingProgressBar";
import ReviewForm from "@/components/productDetail/ReviewForm";
import { Star } from "lucide-react";

const CustomerReviews = () => {
  return (
    <>
      <div className="mx-auto">
        <h3 className="font-semibold text-xl text-center my-6 text-primaryDark">
          Customer Reviews
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
            <h1 className="text-5xl font-bold text-primaryDark">5.0</h1>
            <small className="text-primaryDark text-sm">of 10 review(s)</small>
            <div className="flex gap-2">
              <Star className="w-5 h-5 cursor-pointer" />
              <Star className="w-5 h-5 cursor-pointer" />
              <Star className="w-5 h-5 cursor-pointer" />
              <Star className="w-5 h-5 cursor-pointer" />
              <Star className="w-5 h-5 cursor-pointer" />
            </div>
          </div>
          {/* ------------------------------------------------------- */}

          {/* Rating progress bar */}
          <div className="flex flex-col gap-6 w-[700px] max-md:w-full">
            <RatingProgressBar rating="Excellent" numRating={10} />
            <RatingProgressBar rating="Very Good" numRating={8} />
            <RatingProgressBar rating="Good" numRating={6} />
            <RatingProgressBar rating="Fair" numRating={5} />
            <RatingProgressBar rating="Poor" numRating={3} />
          </div>
          {/* ------------------------------------------------------- */}
        </div>

        {/* Review modal form */}
        <div className="flex justify-center items-center w-full mb-5">
          <Modal>
            <ReviewForm />
          </Modal>
        </div>
        {/* ------------------------------------------------------- */}
      </div>
    </>
  );
};

export default CustomerReviews;
