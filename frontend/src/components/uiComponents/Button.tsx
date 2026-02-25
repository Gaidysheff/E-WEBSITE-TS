import { type FormEvent } from "react";

type Props = {
  className: string;
  children: React.ReactNode;
  disabled: boolean;
  handleClick: (event: FormEvent) => void;
  // handleClick: VoidFunction;
};

const Button = ({ className, children, disabled, handleClick }: Props) => {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={className}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export default Button;
