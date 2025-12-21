import Image from "@/assets/images/error/Error.jpg";

const Error = () => {
  return (
    <div className="h-auto relative">
      {/* <img className="h-[100%] object-center" src={Image} alt="Error" />
      <span className="absolute left-0 top-[50%] bg-red-500 text-white text-5xl">
        Something went wrong
      </span> */}
      <div
        className="bg-[url(@/assets/images/error/Error.jpg)] bg-no-repeat
				h-[70vh] bg-size-cover flex items-center justify-center"
      >
        <div className="bg-red-500 text-white text-5xl p-5 rounded-xl">
          Something went wrong
        </div>
      </div>
    </div>
  );
};

export default Error;
