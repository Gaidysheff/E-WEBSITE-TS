import api from "@/api/api";
import { env } from "@/lib/env";
import { type User } from "@/lib/types";

import { toast } from "react-toastify";

const BASE_URL = env.VITE_API_URL;

const REGISTER_URL = `${BASE_URL}/users/register/`;
const LOGIN_URL = `${BASE_URL}/users/login/`;
// const LOGOUT_URL = `${BASE_URL}/logoutall/`;
// const PASSWORD_RESET_URL = `${BASE_URL}/password_reset/`;
// const PASSWORD_CONFIRM_URL = `${BASE_URL}/password_reset/confirm/`;

type Auth = Pick<User, "email" | "password">;

// ======================= API Requests =================================

export const register = async (value: Auth) => {
  try {
    await api
      .post(REGISTER_URL, {
        email: value.email,
        password: value.password,
      })
      .then(() => {
        toast.success("You have been successfully registered 👋!");
      });
  } catch (error) {
    console.log("🚀 ~ Register ~ error:", error);
  }
};

export const login = async (value: Auth) => {
  try {
    await api
      .post(LOGIN_URL, {
        email: value.email,
        password: value.password,
      })
      .then((response) => {
        // console.log("🚀 ~ Login ~ Response:", response.data);
        localStorage.setItem("Token", response.data.token);
        toast.success("You have been successfully authorized 👋!");
        // -------- Delay for showing toaster ------------
        const reloadDelay = () => {
          window.location.reload();
        };
        setTimeout(reloadDelay, 3000);
      });
  } catch (error) {
    console.log("🚀 ~ Register ~ error:", error);
    toast.error(
      "Login has failed, please try again, or reset your password 🤚 🚨",
      { autoClose: 10000, hideProgressBar: true }
    );
  }
};

// export const logout = async () => {
//   try {
//     await api.post(LOGOUT_URL, {}).then(() => {
//       localStorage.removeItem("Token");
//       toast.info("You have left the authorized area 👋! ");
//       // -------- Delay for showing toaster ------------
//       const reloadDelay = () => {
//         window.location.reload();
//       };
//       setTimeout(reloadDelay, 3000);
//     });
//   } catch (error) {
//     console.log("🚀 ~ Register ~ error:", error);
//   }
// };

// export const passwordResetRequest = async (value) => {
//   try {
//     await api.post(PASSWORD_RESET_URL, {
//       email: value.email,
//     });
//     //   .then((response) => {
//     //     console.log("🚀 ~ passwordResetRequest ~ Response:", response.data);
//     // });
//   } catch (error) {
//     console.log("🚀 ~ passwordResetRequest ~ error:", error);
//   }
// };

// export const passwordConfirm = async (value) => {
//   // console.log("🚀 ~ PasswordReset ~ value:", value);
//   // console.log("🚀 ~ PasswordReset ~ token-OUT:", token);
//   try {
//     await api
//       .post(PASSWORD_CONFIRM_URL, {
//         password: value.password,
//         token: token,
//       })
//       .then(() => {
//         // .then((response) => {
//         //   console.log("🚀 ~ Login ~ Response:", response.data);
//         toast.success(
//           "Your password reset was successful, \
//           you will be directed to the login page in a second 👋!"
//         );
//       });
//   } catch (error) {
//     console.log("🚀 ~ Register ~ error:", error);
//     // toast.error(
//     //   "Login has failed, please try again, or reset your password 🤚 🚨",
//     //   { autoClose: 10000, hideProgressBar: true }
//     // );
//   }
// };
