import ProductCard from "@/components/sectionProduct/ProductCard.tsx";
import ProductCardSkeleton from "@/components/sectionProduct/ProductCardSkeleton.tsx";
import { type Product } from "@/lib/types.ts";
import Skeleton from "react-loading-skeleton";
import PageBreak from "@/components/pagination/PageBreak.tsx";
import SortSelector from "./SortSelector.tsx";

interface Props {
  filteredResults: Product[] | undefined;
  isFetching: boolean;
  totalPages: number;
  currentPage: number;
}

const FilteredResult = ({
  filteredResults,
  isFetching,
  totalPages,
  currentPage,
}: Props) => {
  return (
    <section className="mx-auto my-5">
      <h2 className="my-9 text-center text-xl font-bold text-primaryDark">
        {isFetching ? (
          <>
            <Skeleton width={200} height={40} />
            <Skeleton width={250} height={30} />
          </>
        ) : (
          <div className="flex flex-col items-center gap-5">
            <h2>FilteredResult</h2>
            <SortSelector />
          </div>
        )}
      </h2>

      {/* Content */}
      <>
        <div className="flex-center flex-wrap gap-6">
          {isFetching && <ProductCardSkeleton cards={10} />}
        </div>

        {filteredResults === undefined ? null : filteredResults.length ? (
          <div className="flex flex-col gap-5">
            <div className="flex-center flex-wrap gap-6">
              {filteredResults.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="my-5">
              <PageBreak totalPages={totalPages} currentPage={currentPage} />
            </div>
          </div>
        ) : (
          <div className="text-myMainColor font-semibold text-xl text-center">
            No products match your criteria.
          </div>
        )}
      </>
    </section>
  );
};

export default FilteredResult;
