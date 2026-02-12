import { useEffect } from "react";

const FaviconShoppingBasket = () => {
  useEffect(() => {
    function updateFavicon() {
      // console.log("🚀 ~ FaviconShoppingBasket:", document.hidden);
      // if (document.hidden) {
      //   window.location.reload();
      // }
      const favicon = document.querySelector('link[rel="icon"][sizes="any3"]');
      const path = document.hidden
        ? "/shopping-basket-inactive.svg"
        : "/shopping-basket.svg";
      favicon?.setAttribute("href", path);
    }

    document.addEventListener("visibilitychange", updateFavicon);
    return () => {
      document.removeEventListener("visibilitychange", updateFavicon);
    };
  }, []);
  return null;
};

export default FaviconShoppingBasket;
