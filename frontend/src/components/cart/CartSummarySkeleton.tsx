import Skeleton from "react-loading-skeleton";

const CartSummary = () => {
  return (
    <div
      className="xl:w-[400px] max-lg:w-full border border-primaryDark
      rounded-lg shadow-xl bg-card px-8 py-6"
    >
      <Skeleton height={35} width={200} />

      <div className="w-full flex items-center justify-between py-2">
        <Skeleton height={25} width={80} />
        <Skeleton height={20} width={40} />
      </div>

      <div className="w-full flex items-center justify-between py-2">
        <Skeleton height={25} width={140} />
        <Skeleton height={20} width={40} />
      </div>

      <hr className="my-4 border-primary" />

      <div className="w-full flex items-center justify-between py-2">
        <Skeleton height={25} width={60} />
        <Skeleton height={20} width={40} />
      </div>

      <Skeleton height={50} />
    </div>
  );
};

export default CartSummary;
