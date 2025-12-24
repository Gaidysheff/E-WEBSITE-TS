import { Laptop } from "lucide-react";

const CategoryBtn = () => {
  return (
    <button type="button" className="cat-btn">
      {/* Icon Container */}
      <div
        className="w-[40px] h-[40px] bg-white rounded-full overflow-hidden
      flex items-center justify-center shadow-sm icon-container-round"
      >
        <Laptop
          className="object-contain stroke-primaryDark/50"
          width={40}
          height={40}
        />
      </div>

      {/* Category Name */}
      <p className="font-semibold text-primaryDark text-[16px]">Electronics</p>
    </button>
  );
};

export default CategoryBtn;
