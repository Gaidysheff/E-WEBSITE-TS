import { Loader, Lock } from "lucide-react";

const PaymentLoader = () => (
  <div
    className="fixed inset-0 z-[9999] bg-white backdrop-blur-sm
    flex flex-col items-center justify-center"
  >
    <div
      className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100
      flex flex-col items-center"
    >
      <Loader className="w-12 h-12 text-myMainColor animate-spin mb-4" />
      <h2 className="text-xl font-bold text-gray-800">Processing Payment...</h2>
      <p className="text-sm text-gray-500 mt-2">
        Please do not close this window
      </p>

      <div
        className="mt-6 flex items-center gap-2 text-[10px] text-gray-400
        uppercase tracking-widest"
      >
        <Lock className="size-3" /> Secure Encrypted Connection
      </div>
    </div>
  </div>
);

export default PaymentLoader;
