import { type Category } from "@/lib/types.ts";
import { BASE_URL } from "@/api/api";
import { Link, useParams } from "@tanstack/react-router";
import { cn } from "@/lib/utils.ts";

type Props = {
  cat: Category;
};

const CategoryBtn = ({ cat }: Props) => {
  const { categoryId } = useParams({ strict: false });
  const btnSlug = `${cat.slug}`;

  return (
    <Link to={`/categories/${cat.slug}`}>
      {/* <button className="cat-btn"> */}
      <button
        type="button"
        className={cn(
          "cat-btn",
          categoryId == btnSlug ? "cat-btn-active" : "cat-btn-passive",
        )}
      >
        {/* Icon Container */}
        <div
          className="w-[40px] h-[40px] bg-white rounded-full overflow-hidden
          flex items-center justify-center shadow-sm icon-container-round"
        >
          <img
            src={`${BASE_URL}${cat.image}`}
            width={30}
            height={30}
            className="object-contain stroke-gray-600"
            alt="thumbnail"
          />
        </div>

        {/* Category Name */}
        <p className="font-semibold text-[16px]">{cat.name}</p>
      </button>
    </Link>
  );
};

export default CategoryBtn;
