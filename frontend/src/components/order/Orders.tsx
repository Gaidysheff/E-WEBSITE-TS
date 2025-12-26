import OrderContainer from "./OrderContainer.jsx";

const Orders = () => {
  return (
    <>
      <p
        className="font-semibold text-2xl max-sm:text-[16px] text-primaryDark
        my-4 text-center"
      >
        Your Orders
      </p>

      <OrderContainer />
    </>
  );
};

export default Orders;
