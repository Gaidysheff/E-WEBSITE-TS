import IndividualOrder from "./IndividualOrder";

const OrderContainer = () => {
  return (
    <div
      className="w-full h-[320px] sm:h-[410px] overflow-y-auto space-y-6
      rounded-md bg-card"
    >
      <IndividualOrder />
      <IndividualOrder />
      <IndividualOrder />
    </div>
  );
};

export default OrderContainer;
