import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { AppLink as Link } from "@/components/appLink/AppLink";
import { useI18nContext } from "@/i18n/i18n-react";

// import { Link } from "@tanstack/react-router";

const WishlistTooltip = () => {
  const { LL } = useI18nContext();

  return (
    <Tooltip>
      <TooltipTrigger className="wish-btn opacity-50">
        <Link to="/$lang/login">
          {LL.productSection.addWishlist()}
          {/* Add to Wishlist */}
        </Link>
      </TooltipTrigger>
      <TooltipContent redTooltip className="bg-red-500 text-xl">
        <p>
          {LL.productSection.addWishlistTooltip()}
          {/* Login to add product to your Wishlist */}
        </p>
      </TooltipContent>
    </Tooltip>
  );
};

export default WishlistTooltip;
