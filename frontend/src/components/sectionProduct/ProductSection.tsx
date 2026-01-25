import { useEffect, useState } from "react";
import { FEATURED_PRODUCT_LIST_URL } from "@/api/endpoints.ts";
import ProductCard from "./ProductCard";
import api from "@/api/api.ts";
import { type Product } from "@/lib/types.ts";
import ProductCardSkeleton from "./ProductCardSkeleton.tsx";
import Skeleton from "react-loading-skeleton";

type Props = {
  title: string;
  similar_products: Product[];
  detailPage: boolean;
  loadingFromDetailPage: boolean;
};

const ProductSection = ({
  title,
  similar_products,
  detailPage,
  loadingFromDetailPage,
}: Props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getProducts = async () => {
    try {
      await api.get(FEATURED_PRODUCT_LIST_URL).then((response) => {
        // console.log("🚀 ~ getProducts ~ response:", response);
        // console.log("🚀 ~ getProducts ~ response:", response.data);

        const res = response.data;
        const loadedData = [];

        for (const key in res) {
          loadedData.push({
            id: res[key].id,
            name: res[key].name,
            description: res[key].description,
            price: res[key].price,
            slug: res[key].slug,
            image: res[key].image,
            featured: res[key].featured,
            category: res[key].category.name,
          });
        }

        setProducts(loadedData);
      });
    } catch (error) {
      console.log("🚀 ~ Register ~ error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (detailPage) {
    useEffect(() => {
      setProducts(similar_products);
      // console.log("🚀 ~ XXXXXXX:", similar_products);
      setIsLoading(false);
    });
  } else {
    useEffect(() => {
      getProducts();
      // console.log("🚀 ~ YYYYYYY:");
    }, []);
  }

  return (
    <section className="mx-auto my-30">
      <h2 className="my-9 text-center text-xl font-bold text-primaryDark">
        {isLoading || loadingFromDetailPage ? (
          <Skeleton width={300} height={40} />
        ) : (
          `${title}`
        )}
      </h2>

      {/* Content */}
      <div className="flex-center flex-wrap gap-6">
        {isLoading && <ProductCardSkeleton cards={10} />}

        {loadingFromDetailPage && <ProductCardSkeleton cards={5} />}

        {products &&
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
      </div>
    </section>
  );
};

export default ProductSection;
