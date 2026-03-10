const CardVerificationCode = () => {
  return (
    <div
      className="flex items-center justify-between gap-1 sm:gap-2 absolute 
      bottom-[1.95rem] 2xsm:bottom-[2.2rem] xsm:bottom-[3rem] sm:bottom-[6.9rem]
      right-[0.1rem] sm:right-[10rem]"
    >
      <p
        className="uppercase text-[0.5rem] 2xsm:text-[0.525rem]
        xsm:text-[0.66rem] sm:text-sm"
      >
        CVC/CVV/CVP
      </p>
      <div
        className="bg-white text-myMainColorDarker rounded-xs sm:p-1
              font-mono w-[4ch] mr-2 text-center
              text-[0.5rem] 2xsm:text-[0.525rem] xsm:text-[0.6562rem] sm:text-sm
              h-[1rem] 2xsm:h-[1.2rem] xsm:h-[1.65rem] sm:h-[2.2rem]
              focus:outline-white focus:outline-1 focus:outline-offset-1
              2xsm:focus:outline-2 2xsm:focus:outline-offset-2
              sm:focus:outline-3 sm:focus:outline-offset-3"
      ></div>
    </div>
  );
};

export default CardVerificationCode;
