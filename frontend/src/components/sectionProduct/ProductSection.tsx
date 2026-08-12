import { useEffect, useState } from "react";
import { FEATURED_PRODUCT_LIST_URL } from "@/api/endpoints.ts";
import ProductCard from "./ProductCard";
import { publicApi } from "@/api/api.ts";
import { type Product } from "@/lib/types.ts";
import ProductCardSkeleton from "./ProductCardSkeleton.tsx";
import Skeleton from "react-loading-skeleton";

type Props = {
  title?: string;
  similar_products?: Product[];
  detailPage?: boolean;
  loadingFromDetailPage?: boolean;
};

const ProductSection = ({
  title,
  similar_products,
  detailPage,
  loadingFromDetailPage,
}: Props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Вытаскиваем сохраненный язык из localStorage или проверяем язык браузера
  const savedLang = localStorage.getItem("app_lang") || "ru";

  const getProducts = async () => {
    try {
      await publicApi.get(FEATURED_PRODUCT_LIST_URL).then((response) => {
        const res = response.data;
        const loadedData = [];

        for (const key in res) {
          loadedData.push({
            id: res[key].id,
            name: res[key].name,
            slug: res[key].slug,
            brand: res[key].brand,
            color: res[key].color,
            description: res[key].description,
            price: res[key].price,
            image: res[key].image,
            featured: res[key].featured,
            carousel: res[key].carousel,
            category: res[key].category.name,
            gender: res[key].gender,
            shape: res[key].shape,
            isAvailable: res[key].is_available,
            // is_available: res[key].is_available, сделать замену в типах
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

  // if (detailPage) {
  //   useEffect(() => {
  //     similar_products && setProducts(similar_products);
  //     setIsLoading(false);
  //   });
  // } else {
  //   useEffect(() => {
  //     getProducts();
  //   }, [savedLang]);
  // }

  useEffect(() => {
    if (detailPage) {
      // Случай 1: Страница товара (берем похожие товары из пропсов)
      if (similar_products) {
        setProducts(similar_products);
      }
      setIsLoading(false);
    } else {
      // Случай 2: Главная страница (загружаем товары с сервера)
      setIsLoading(true);
      getProducts(); // Ваша функция загрузки
    }

    // Принудительный скролл вверх при смене страницы или языка
    // window.scrollTo(0, 0);
  }, [detailPage, similar_products, savedLang]); // <--- Теперь всё под контролем

  return (
    <section>
      <div className="container">
        <div className="mx-auto py-10">
          <h2 className="py-9 text-center text-xl font-bold text-primaryDark">
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
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
