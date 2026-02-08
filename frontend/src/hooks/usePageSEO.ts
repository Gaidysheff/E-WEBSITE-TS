import Image from "@/assets/images/shared/OnlineShop.png";
import { useEffect } from "react";

interface Props {
  title: string;
  description: string;
  // keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
}

const usePageSEO = ({
  title,
  description,
  // keywords = [],
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
}: Props) => {
  useEffect(() => {
    document.title = title;

    setMetaTag("name", "description", description);
    // setMetaTag("name", "keywords", keywords);
    setMetaTag("property", "og:title", ogTitle || title);
    setMetaTag("property", "og:description", ogDescription || description);
    setMetaTag("property", "og:image", ogImage || `${Image}`);
    setMetaTag("property", "og:url", ogUrl || window.location.href);

    return () => {
      // do any kind of cleanup here
    };
  }, [
    title,
    description,
    // keywords,
    ogTitle,
    ogDescription,
    ogImage,
    ogUrl,
  ]);
};

const setMetaTag = (attr: string, key: string, content: string) => {
  if (content) {
    let element = document.querySelector(`meta[${attr}="${key}"]`);
    if (!element) {
      element = document.createElement("meta");
      element.setAttribute(attr, key);
      document.head.appendChild(element);
    }
    element.setAttribute("content", content);
  }
};

export default usePageSEO;
