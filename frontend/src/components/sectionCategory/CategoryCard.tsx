import { type Category } from "@/lib/types.ts";

import { BASE_URL } from "@/api/api";

type Props = {
  cat: Category;
};

const CategoryCard = ({ cat }: Props) => {
  return (
    <div
      className="w-[160px] h-[90px] sm:w-[220px] sm:h-[120px] bg-card
			flex flex-col items-center justify-center p-4 shadow-xl rounded-2xl
      dark:drop-shadow-[5px_5px_5px_rgba(255,255,255,0.25)]
			transition-transform duration-300 hover:scale-110 cursor-pointer"
    >
      {/* Category Icon */}
      <div className="bg-card p-1 sm:p-3 rounded-full">
        <img
          src={`${BASE_URL}${cat.image}`}
          className="stroke-primaryDark"
          width={40}
          height={40}
          alt=""
        />
      </div>

      {/* Category Name */}
      <p className="font-semibold sm:mt-1 text-primaryDark text-sm sm:text-lg">
        {cat.name}
      </p>
    </div>
  );
};

export default CategoryCard;

// import { Link } from "@tanstack/react-router";

// const CategoryCard = ({ cat }) => {
//   return (
//     <Link to={`/categories/${cat.slug}`}>
//       <div
//         className="w-[160px] h-[90px] sm:w-[220px] sm:h-[120px] bg-card
// 			flex flex-col items-center justify-center p-4 shadow-xl rounded-2xl
//       dark:drop-shadow-[5px_5px_5px_rgba(255,255,255,0.25)]
// 			transition-transform duration-300 hover:scale-110 cursor-pointer"
//       >
//         {/* Category Icon */}
//         <div className="bg-card p-1 sm:p-3 rounded-full">
// <img
//   src={`${BASE_URL}${cat.image}`}
//   className="stroke-primaryDark"
//   width={40}
//   height={40}
//   alt=""
// />
//         </div>

//         {/* Category Name */}
//         <p className="font-semibold sm:mt-1 text-primaryDark text-sm sm:text-lg">
//           {cat.name}
//         </p>
//       </div>
//     </Link>
//   );
// };

// export default CategoryCard;
