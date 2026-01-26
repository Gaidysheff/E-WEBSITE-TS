import { useUser } from "@/store/UserContext.tsx";
import Collapse from "@/components/uiComponents/Collapse.tsx";
import { type Review, type ProductInDetails } from "@/lib/types.ts";

interface Props {
  reviews: Review[];
  product: ProductInDetails;
}

const ReviewCardContainer = ({ reviews, product }: Props) => {
  const user = useUser();

  return (
    <>
      <Collapse reviews={reviews} user={user} product={product} />
    </>
  );
};

export default ReviewCardContainer;
