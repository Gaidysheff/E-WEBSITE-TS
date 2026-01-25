import { type Review } from "@/lib/types.ts";
import { useUser } from "@/store/UserContext.tsx";
import Collapse from "@/components/uiComponents/Collapse.tsx";

interface Props {
  reviews: Review[];
}

const ReviewCardContainer = ({ reviews }: Props) => {
  const user = useUser();

  return (
    <>
      <Collapse reviews={reviews} user={user} />
    </>
  );
};

export default ReviewCardContainer;
