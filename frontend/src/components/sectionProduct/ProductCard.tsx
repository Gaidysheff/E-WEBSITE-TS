import Product from "@/assets/images/product/Product-1.png";

type Props = {};

const ProductCard = (props: Props) => {
  return (
    <div
      className="w-[280px] rounded-lg bg-card flex flex-col items-center gap-4
        shadow-2xl dark:drop-shadow-[10px_10px_10px_rgba(255,255,255,0.35)]
        px-5 py-6 transition-all duration-300 hover:shadow-xl hover:scale-105
        cursor-pointer grayscale hover:grayscale-0"
    >
      <div className="w-[200px] h-[200px] rounded-md overflow-hidden">
        <img
          src={Product}
          className="object-cover w-full h-full"
          // width={200}
          // height={200}
          alt="thumbnail"
        />
      </div>

      {/* Product Name */}
      <p className="text-center text-lg font-semibold text-primaryDark">
        Apple Gaming Pad
      </p>

      {/* Product Price */}
      <p className="text-[18px] text-center font-bold text-primaryDark">
        $ 300.00
      </p>
    </div>
  );
};

export default ProductCard;

// import { BASE_URL } from "@/api/api";
// import { Link } from "@tanstack/react-router";
// import { NumericFormat } from "react-number-format";
// import { useNavigate } from "@tanstack/react-router";

// const ProductCard = ({ product }) => {
//   // const navigate = useNavigate();
//   // const handleClick = () => {
//   //   navigate(`/products/${product.slug}`);
//   //   window.location.reload();
//   // };
//   // const reloadHandler = () => {
//   //   window.location.reload();
//   // };
//   return (
//     <Link to={`/products/${product.slug}`} reloadDocument>
//       <div
//         className="w-[280px] rounded-lg bg-card flex flex-col items-center gap-4
//         shadow-2xl dark:drop-shadow-[10px_10px_10px_rgba(255,255,255,0.35)]
//         px-5 py-6 transition-all duration-300 hover:shadow-xl hover:scale-105
//         cursor-pointer grayscale hover:grayscale-0"
//       >
//         <div className="w-[200px] h-[200px] rounded-md overflow-hidden">
//           <img
//             src={`${BASE_URL}${product.image}`}
//             className="object-cover w-full h-full"
//             // width={200}
//             // height={200}
//             alt="thumbnail"
//           />
//         </div>

//         {/* Product Name */}
//         <p className="text-center text-lg font-semibold text-primaryDark">
//           {product.name}
//         </p>

//         {/* Product Price */}
//         <p className="text-[18px] text-center font-bold text-primaryDark">
//           <NumericFormat
//             value={product.price}
//             displayType={"text"}
//             thousandSeparator="."
//             decimalSeparator=","
//             prefix={"$ "}
//             // suffix={" ₽"}
//           />
//           {/* ${product.price} */}
//         </p>
//       </div>
//     </Link>
//   );
// };

// export default ProductCard;
