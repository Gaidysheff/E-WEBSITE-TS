import { Separator } from "@/components/ui/separator";
import Skeleton from "react-loading-skeleton";

const SkeletonFilters = () => {
  return (
    <>
      {/* Shape */}
      <Skeleton height={25} width={100} />
      <div className="my-5">
        <Skeleton height={30} width={300} />
      </div>

      <Separator className="h-[1px] my-5" />
      {/* Brands  */}
      <Skeleton height={25} width={100} />
      <div className="my-5">
        <div className="flex flex-row gap-3">
          <Skeleton height={20} width={20} />
          <Skeleton height={20} width={200} />
        </div>
        <div className="flex flex-row gap-3">
          <Skeleton height={20} width={20} />
          <Skeleton height={20} width={200} />
        </div>
        <div className="flex flex-row gap-3">
          <Skeleton height={20} width={20} />
          <Skeleton height={20} width={200} />
        </div>
      </div>

      <Separator className="h-[1px] my-5" />
      {/* Price  */}
      <Skeleton height={25} width={100} />
      <div className="my-5">
        <Skeleton height={30} width={300} />
      </div>

      <Separator className="h-[1px] my-5" />
      {/* Color  */}
      <Skeleton height={25} width={100} />
      <div className="my-5">
        <Skeleton height={30} width={300} />
      </div>

      <Separator className="h-[1px] my-5" />
      {/* RatingFilter  */}
      <Skeleton height={25} width={100} />
      <div className="my-5">
        <Skeleton height={30} width={300} />
      </div>

      <Separator className="h-[1px] my-5" />
      {/* Searching */}
      <Skeleton height={25} width={100} />
      <Skeleton height={30} width={300} />
    </>
  );
};

export default SkeletonFilters;
