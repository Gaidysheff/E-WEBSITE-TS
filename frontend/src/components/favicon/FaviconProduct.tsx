import { useEffect } from "react";

const FaviconProduct = () => {
  useEffect(() => {
    function updateFavicon() {
      // console.log("🚀 ~ FaviconProduct:", document.hidden);
      const favicon = document.querySelector('link[rel="icon"][sizes="any2"]');
      const path = document.hidden ? "/gift-inactive.svg" : "/gift.svg";
      favicon?.setAttribute("href", path);
    }

    document.addEventListener("visibilitychange", updateFavicon);
    return () => {
      document.removeEventListener("visibilitychange", updateFavicon);
    };
  }, []);
  return null;
};

export default FaviconProduct;
