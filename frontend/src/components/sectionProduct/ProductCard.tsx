import { type Product } from "@/lib/types.ts";
import { BASE_URL } from "@/api/api";

// import { NumericFormat } from "react-number-format";

// import { Link } from "@tanstack/react-router";
import { AppLink as Link } from "@/components/appLink/AppLink";
import { useCurrency } from "@/store/CurrencyContext";

type Props = {
  product: Product;
};

const ProductCard = ({ product }: Props) => {
  const { formatPrice } = useCurrency();

  return (
    <Link to={`/products/${product.slug}`}>
      <div
        className="w-[280px] rounded-lg bg-card flex flex-col items-center gap-4
          shadow-2xl dark:drop-shadow-[10px_10px_10px_rgba(255,255,255,0.35)]
          px-5 py-6 transition-all duration-300 hover:shadow-xl hover:scale-105
          cursor-pointer grayscale hover:grayscale-0"
      >
        {!product.is_available && (
          <div
            className="block absolute mt-[25%] xsm:mt-[30%] text-center
                      flex flex-col z-40 top-0 inset-x-0 py-1 xsm:py-4 
                      bg-gray-400/20 dark:bg-gray-300/20 
                      backdrop-grayscale backdrop-blur-xl"
          >
            <span
              className="font-semibold italic text-myMainColor/70
                      z-50 drop-shadow-[2px_2px_1px_rgba(255,255,255,.9)]
                      text-base sm:text-xl md:text-base lg:text-xl"
            >
              Нет в наличии
            </span>
            <span
              className="font-semibold italic text-myMainColor/70
                      z-50 drop-shadow-[2px_2px_1px_rgba(255,255,255,.9)]
                      text-sm sm:text-xl md:text-base lg:text-xl"
            >
              Ожидаем в ближайшее время
            </span>
          </div>
        )}
        <div className="w-[200px] h-[200px] rounded-md overflow-hidden">
          <img
            src={`${BASE_URL}${product.image}`}
            className="object-cover w-full h-full"
            // width={200}
            // height={200}
            alt="thumbnail"
          />
        </div>
        {/* Product Name */}
        <p className="text-center text-lg font-semibold text-primaryDark">
          {product.name}
        </p>

        {/* Product Price */}
        <p className="text-[18px] text-center font-bold text-primaryDark">
          {formatPrice(product.price)}

          {/* <NumericFormat
            value={formatPrice(product.price)}
            // value={product.price}
            displayType={"text"}
            thousandSeparator="."
            decimalSeparator=","
            // prefix={"$ "}
            // suffix={" ₽"}
          /> */}

          {/* ${product.price} */}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
