import CardChip from "@/assets/images/payments/card-chip.svg";

interface Props {
  cardType: string;
}

const CardLogo = ({ cardType }: Props) => {
  return (
    <div className="flex justify-between items-center mb-auto">
      <img
        className="grow-0 w-auto
        h-[1.25rem] 2xsm:h-[1.5rem] xsm:h-[1.875rem] sm:h-[2.5rem]"
        src={CardChip}
        alt="Card chip"
      />

      <img
        data-logo
        src={cardType}
        className="h-[1.25rem] 2xsm:h-[1.5rem] xsm:h-[1.875rem] sm:h-[2.5rem]
        w-auto"
        alt="Card Logo"
      />
    </div>
  );
};

export default CardLogo;
