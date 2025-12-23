import CategoryCard from "./CategoryCard.tsx";

// type Props = {};

// const CategorySection = (props: Props) => {
const CategorySection = () => {
  return (
    <section className="mx-auto my-20">
      <h2 className="my-9 text-center text-xl font-bold text-primaryDark">
        "Browse By Category"
      </h2>

      {/* Content */}
      <div className="flex justify-center flex-wrap gap-8">
        <CategoryCard />
        <CategoryCard />
        <CategoryCard />
        <CategoryCard />
        <CategoryCard />
        <CategoryCard />
      </div>
    </section>
  );
};

export default CategorySection;

// import { useEffect, useState } from "react";

// import { CATEGORY_LIST_URL } from "@/api/endpoints.js";

// import CategoryCardSkeleton from "./CategoryCardSkeleton.jsx";
// import Skeleton from "react-loading-skeleton";
// import api from "@/api/api.js";

// const CategorySection = () => {
//   const [categories, setCategories] = useState();
//   const [isLoading, setIsLoading] = useState(true);

//   const getCategories = async () => {
//     // --------------- Fetching delay ----------------------
//     // await new Promise((resolve) => setTimeout(resolve, 4000));
//     // -----------------------------------------------------
//     try {
//       await api.get(CATEGORY_LIST_URL).then((response) => {
//         // console.log("🚀 ~ CONTEXT ~ Response:", response);
//         // console.log("🚀 ~ CONTEXT+DATA ~ Response:", response.data);

//         const res = response.data;
//         const loadedData = [];

//         for (const key in res) {
//           loadedData.push({
//             id: res[key].id,
//             name: res[key].name,
//             image: res[key].image,
//             slug: res[key].slug,
//           });
//         }

//         setCategories(loadedData);
//         setIsLoading(false);
//       });
//     } catch (error) {
//       console.log("🚀 ~ Register ~ error:", error);
//     }
//   };

//   useEffect(() => {
//     getCategories();
//   }, []);

//   return (
//     <section className="mx-auto my-20">
//       <h2 className="my-9 text-center text-xl font-bold text-primaryDark">
//         {isLoading ? (
//           <Skeleton width={300} height={40} />
//         ) : (
//           "Browse By Category"
//         )}
//         {/* {`Browse By Category` || <Skeleton width={100} height={40} />} */}
//       </h2>

//       {/* Content */}
//       <div className="flex justify-center flex-wrap gap-8">
//         {isLoading && <CategoryCardSkeleton cards={6} />}

//         {categories?.map((cat) => (
//           <CategoryCard key={cat.id} cat={cat} />
//         ))}
//       </div>
//     </section>
//   );
// };

// export default CategorySection;
