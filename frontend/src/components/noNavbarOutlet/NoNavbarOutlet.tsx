import { Failure } from "@/routes/_paymentResult/failed.lazy";
import { Login } from "@/routes/_auth/login";
import { PasswordReset } from "@/routes/_auth/password-reset/$token";
import { PasswordResetRequest } from "@/routes/_auth/passwordResetRequest";
import { Register } from "@/routes/_auth/register";
import { Success } from "@/routes/_paymentResult/success.lazy";

interface Props {
  location: {
    pathname: string;
  };
}

const NoNavbarOutlet = ({ location }: Props) => {
  const loginPage = location.pathname === "/login";
  const registerPage = location.pathname === "/register";
  const passwordResetRequest = location.pathname === "/passwordResetRequest";
  const success = location.pathname === "/success";
  const failure = location.pathname === "/failed";

  return (
    <>
      {loginPage ? (
        <Login />
      ) : registerPage ? (
        <Register />
      ) : passwordResetRequest ? (
        <PasswordResetRequest />
      ) : success ? (
        <Success />
      ) : failure ? (
        <Failure />
      ) : (
        <PasswordReset />
      )}
    </>
  );
};

export default NoNavbarOutlet;
