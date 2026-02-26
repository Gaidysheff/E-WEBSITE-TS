import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Link } from "@tanstack/react-router";

// import Button from "@/components/uiComponents/Button";

const WishlistTooltip = () => {
  return (
    <Tooltip>
      <TooltipTrigger className="wish-btn opacity-50">
        <Link to="/login">Add to Wishlist</Link>
      </TooltipTrigger>
      <TooltipContent redTooltip className="bg-red-500 text-xl">
        <p>Login to add product to your Wishlist</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default WishlistTooltip;
