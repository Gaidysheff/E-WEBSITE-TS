import ProductCard from "@/components/sectionProduct/ProductCard.tsx";
import ProductCardSkeleton from "@/components/sectionProduct/ProductCardSkeleton.tsx";
import { type Product } from "@/lib/types.ts";
import Skeleton from "react-loading-skeleton";
import PageBreak from "@/components/pagination/PageBreak.tsx";

interface Props {
  filteredResults: Product[];
  isFetching: boolean;
}

const FilteredResult = ({ filteredResults, isFetching }: Props) => {
  return (
    <section className="mx-auto my-5">
      <h2 className="my-9 text-center text-xl font-bold text-primaryDark">
        {isFetching ? (
          <Skeleton width={300} height={40} />
        ) : (
          <div>FilteredResult</div>
        )}
      </h2>

      {/* Content */}
      <div className="flex-center flex-wrap gap-6">
        {isFetching && <ProductCardSkeleton cards={10} />}

        {filteredResults === undefined ? null : filteredResults.length ? (
          <>
            {filteredResults.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}

            <div className="my-5">
              <PageBreak />
            </div>
          </>
        ) : (
          <div className="text-myMainColor font-semibold text-xl text-center">
            No products match your criteria.
          </div>
        )}
      </div>
    </section>
  );
};

export default FilteredResult;
