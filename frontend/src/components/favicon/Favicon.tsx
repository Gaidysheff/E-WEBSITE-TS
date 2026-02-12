import { useEffect } from "react";

const Favicon = () => {
  useEffect(() => {
    function updateFavicon() {
      // console.log("🚀 ~ Favicon:", document.hidden);
      // if (!document.hidden) {
      // window.location.reload();
      // }
      const favicon = document.querySelector('link[rel="icon"][sizes="any"]');
      const path = document.hidden ? "/favicon-inactive.svg" : "/favicon.svg";
      favicon?.setAttribute("href", path);
    }
    document.addEventListener("visibilitychange", updateFavicon);
    return () => {
      document.removeEventListener("visibilitychange", updateFavicon);
    };
  }, []);
  return null;
};

export default Favicon;
