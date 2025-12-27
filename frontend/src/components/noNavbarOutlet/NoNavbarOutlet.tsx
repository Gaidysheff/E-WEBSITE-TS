import { Login } from "@/routes/_auth/login";
import { PasswordReset } from "@/routes/_auth/password-reset/$token";
import { PasswordResetRequest } from "@/routes/_auth/passwordResetRequest";
import { Register } from "@/routes/_auth/register";

interface Props {
  location: {
    pathname: string;
  };
}

const NoNavbarOutlet = ({ location }: Props) => {
  const loginPage = location.pathname === "/login";
  const registerPage = location.pathname === "/register";
  const passwordResetRequest = location.pathname === "/passwordResetRequest";
  return (
    <>
      {loginPage ? (
        <Login />
      ) : registerPage ? (
        <Register />
      ) : passwordResetRequest ? (
        <PasswordResetRequest />
      ) : (
        <PasswordReset />
      )}
    </>
  );
};

export default NoNavbarOutlet;
