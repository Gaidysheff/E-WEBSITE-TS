import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { Button } from "@/components/ui/button.jsx";
import { ChevronsUpDown } from "lucide-react";
import ReviewCard from "@/components/productDetail/ReviewCard.tsx";
import {
  type Review,
  type UserLoggedIn,
  type ProductInDetails,
} from "@/lib/types.ts";
import { useState } from "react";

interface Props {
  reviews: Review[];
  user: UserLoggedIn | undefined;
  product: ProductInDetails;
}

const Collapse = ({ reviews, user, product }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
      <div className="flex items-center justify-between space-x-4 px-4">
        <h4 className="font-semibold text-primaryDark">
          {reviews.length < 2 ? "Review" : "Reviews"} ({reviews?.length})
        </h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            <ChevronsUpDown className="w-4 h-4">
              <span className="sr-only">Toggle</span>
            </ChevronsUpDown>
          </Button>
        </CollapsibleTrigger>
      </div>
      {!isOpen && (
        <ReviewCard
          key={reviews[0]?.id}
          review={reviews[0]}
          user={user}
          product={product}
        />
      )}
      <CollapsibleContent>
        {reviews.map((review) => (
          <ReviewCard
            key={review?.id}
            review={review}
            user={user}
            product={product}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default Collapse;
