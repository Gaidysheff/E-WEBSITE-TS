type Props = {
  className: string;
  children: React.ReactNode;
  disabled: boolean;
};

const Button = ({ className, children, disabled }: Props) => {
  return (
    <button type="submit" disabled={disabled} className={className}>
      {children}
    </button>
  );
};

export default Button;
