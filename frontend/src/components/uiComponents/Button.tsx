type Props = {
  className: string;
  children: React.ReactNode;
  disabled: boolean;
  handleClick: VoidFunction;
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
