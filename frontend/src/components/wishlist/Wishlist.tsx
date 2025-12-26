import MiniProductCard from "@/components/order/MiniProductCard";

const Wishlist = () => {
  return (
    <section className="my-10">
      <h2
        className="text-center font-bold text-primaryDark mt-2 mb-4 
        text-base xsm:text-lg sm:text-2xl"
      >
        Products added to Wishlist
      </h2>

      {/* Content */}
      <div
        className="flex items-center w-[full] gap-4 px-6 py-6 bg-card
        custom-overflow rounded-lg shadow-sm"
      >
        <MiniProductCard />
        <MiniProductCard />
        <MiniProductCard />
        <MiniProductCard />
      </div>
    </section>
  );
};

export default Wishlist;
