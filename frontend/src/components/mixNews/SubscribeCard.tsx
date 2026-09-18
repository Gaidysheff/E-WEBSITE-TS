import { AppLink as Link } from "@/components/appLink/AppLink";
import Modal from "@/components/uiComponents/Modal.tsx";
import SubscribeForm from "@/components/subscribeToNews/SubscribeForm";
import { useI18nContext } from "@/i18n/i18n-react";
import { useState } from "react";

const SubscribeCard = () => {
  const { LL } = useI18nContext();
  // Может принимать значения: null, "user_info", "address", "review"
  // и теперь "subscribe"
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <div
      className="flex flex-col justify-center gap-5 rounded-lg p-5 
			border border-primary rounded-lg bg-primaryLighter/50 text-primaryDark 
			text-lg font-semibold text-center"
    >
      <p className="text-xl">
        {LL.newsApplication.subscribeTextOne()}
        {/* More news coming soon... */}
      </p>
      <p>
        {LL.newsApplication.subscribeTextTwo()}
        {/* Don't want to miss it? */}
      </p>
      <div>
        <div
          className="text-myMainColor font-semibold
					hover:scale-110 duration-500 text-2xl my-3"
        >
          {/* ------------------------------------------------------ */}
          {/* <Link to={"#"}>
            {LL.newsApplication.subscribeLink()}
            Just subscribe
          </Link> */}
          {/* ------------------------------------------------------ */}
          <Modal
            subscribeForm
            isModalOpen={activeModal === "subscribe"}
            // Откроется, только если стейт равен "subscribe"
            setIsModalOpen={(open) => setActiveModal(open ? "subscribe" : null)}
          >
            <SubscribeForm setIsModalOpen={() => setActiveModal(null)} />
          </Modal>
          {/* ------------------------------------------------------ */}
        </div>{" "}
        <p>
          {LL.newsApplication.subscribeTextThree()}
          {/* for receiving our freshest news in your email box. */}
        </p>
      </div>
    </div>
  );
};

export default SubscribeCard;
