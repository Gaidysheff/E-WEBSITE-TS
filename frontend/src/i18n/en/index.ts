import type { Translation } from "../i18n-types.js";

const en: Translation = {
  introduction: {
    slogan: '"Click. Buy. Enjoy!"',
  },
  hero: {
    title: "Find the Perfect Product for Every Occasion",
    subtitle:
      "Discover a curated selection of high-quality products designed to fit your lifestyle.",
    btn: "Shop Now",
  },
  categorySection: {
    title: "Browse By Category",
    error:
      "Sorry, there was an unexpected server ERROR while loading categories!!!",
  },
  productSection: {
    titleFeatured: "Featured Products",
    titleRelated: "Products from the same category",
    details: "Details:",
    adding: "Adding to Cart ...",
    added: "Added to Cart",
    addCart: "Add to Cart",
    updating: "Updating ...",
    remove: "Remove from Wishlist",
    addWishlist: "Add to Wishlist",
    toastError: "Something went wrong",
    toastCartSuccess: "Selected item added successfully!",
    toastWishlistSuccess: "Item added to your Wishlist successfully!",
    toastWishlistInfo: "Item removed from your Wishlist successfully!",
    reviews: "Customer Reviews",
    excellent: "Excellent",
    veryGood: "Very Good",
    good: "Good",
    fair: "Fair",
    poor: "Poor",
    reviewsCount: "of {count} {reviewWord}",
  },

  failedPage: {
    title: "Oops! Payment Failed.",
    description:
      "Something went wrong while processing your payment. Don't worry — your card hasn't been charged.",
    tryAgain: "Try Again",
    contactUs: "Contact us",
    contactSupportWa: "Contact Support - WhatsApp",
    contactSupportEmail: "Contact Support - Email",
    chatWithSupport: "Chat with Support",
    emailSubject: "Payment error for order (Cart: {cartCode})",
  },
};

export default en;
