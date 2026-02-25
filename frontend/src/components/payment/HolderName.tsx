interface Props {
  userName: string;
  getName: (userName: string) => void;
}

const HolderName = ({ userName, getName }: Props) => {
  return (
    <div className="flex flex-col gap-1 sm:gap-2 grow-1 sm:mr-4">
      <label
        htmlFor="name"
        className="uppercase text-[0.5rem] 2xsm:text-[0.525rem]
        xsm:text-[0.66rem] sm:text-sm"
      >
        Name
      </label>
      <input
        type="text"
        id="name"
        value={userName}
        onChange={(e) => getName(e.target.value)}
        required
        className="bg-white text-myMainColorDarker rounded-xs p-1
        text-[0.5rem] 2xsm:text-[0.525rem] xsm:text-[0.6562rem] sm:text-sm
        h-[1rem] 2xsm:h-[1.2rem] xsm:h-[1.65rem] sm:h-[2.2rem]
        focus:outline-white focus:outline-1 focus:outline-offset-1
        2xsm:focus:outline-2 2xsm:focus:outline-offset-2
        sm:focus:outline-3 sm:focus:outline-offset-3"
      />
    </div>
  );
};

export default HolderName;
