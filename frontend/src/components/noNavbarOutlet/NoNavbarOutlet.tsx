import { Failure } from "@/routes/$lang/_paymentResult/failed.lazy";
import { Login } from "@/routes/$lang/_auth/login";
import { Outlet } from "@tanstack/react-router";
import { PasswordReset } from "@/routes/$lang/_auth/password-reset/$token";
import { PasswordResetRequest } from "@/routes/$lang/_auth/passwordResetRequest";
import { Register } from "@/routes/$lang/_auth/register";
import { Success } from "@/routes/$lang/_paymentResult/success.lazy";

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
      {/* {loginPage ? (
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
      )} */}
      <Outlet />
    </>
  );
};

export default NoNavbarOutlet;
