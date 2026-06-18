import OrderContainer from "./OrderContainer.jsx";
import { useI18nContext } from "@/i18n/i18n-react";

const Orders = () => {
  const { LL } = useI18nContext();
  return (
    <>
      <p
        className="font-semibold text-2xl max-sm:text-[16px] text-primaryDark
        my-4 text-center"
      >
        {LL.profile.ordersTitle()}
        {/* Your Orders */}
      </p>

      <OrderContainer />
    </>
  );
};

export default Orders;
