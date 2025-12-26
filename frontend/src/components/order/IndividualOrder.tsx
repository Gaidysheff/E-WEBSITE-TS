import MiniProductCard from "./MiniProductCard";

const IndividualOrder = () => {
  return (
    <div
      className="w-full border border-gray-400 bg-card px-4 py-4 rounded-lg
      shadow-sm"
    >
      {/* Order Header */}
      <div
        className="w-full bg-card px-4 py-3 rounded-md
        flex items-center justify-between shadow-sm border border-gray-400"
      >
        <p
          className="text-sm sm:text-base font-medium text-primaryDark
          max-2xsm:hidden"
        >
          ORDER ID:{" "}
          <span className="text-green-600 font-semibold">
            PO-147-17039646431273026
          </span>
        </p>
      </div>

      {/* Order Items */}
      <div className="w-full py-4 flex items-center gap-4 custom-overflow">
        <MiniProductCard />
        <MiniProductCard />
        <MiniProductCard />
        <MiniProductCard />
      </div>
    </div>
  );
};

export default IndividualOrder;
