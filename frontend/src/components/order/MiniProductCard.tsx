import Image from "@/assets/images/product/a_box.png";
import { Link } from "@tanstack/react-router";

const MiniProductCard = () => {
  return (
    <Link
      to={"/"}
      className="w-[150px] sm:w-[220px] rounded-lg shadow-md bg-card 
      flex flex-col items-center gap-3 px-4 py-5 transition-all duration-300 
      hover:shadow-lg hover:scale-105 cursor-pointer border border-gray-400"
    >
      <div
        className="w-[100px] h-[100px] sm:w-[160px] sm:h-[160px] rounded-md
        overflow-hidden"
      >
        <img
          src={Image}
          className="object-cover w-full h-full"
          width={160}
          height={160}
          alt="thumbnail"
        />
      </div>

      {/* Product Name */}
      <p
        className="text-center text-xs sm:text-base font-medium
        text-primaryDark"
      >
        Apple Smart Watch
      </p>

      {/* Product Price */}
      <p
        className="text-xs sm:text-base text-center font-bold 
        text-primaryDark"
      >
        $ 300.00
      </p>
    </Link>
  );
};

export default MiniProductCard;
