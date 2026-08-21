import privateApi, { publicApi } from "@/api/api.ts";

import { env } from "@/lib/env";
import { type User } from "@/lib/types";
const BASE_URL = env.VITE_API_URL;

const LOGOUT_URL = `${BASE_URL}/api/logoutall/`;
const REGISTER_URL = `${BASE_URL}/api/users/register/`;
const LOGIN_URL = `${BASE_URL}/api/users/login/`;
const PASSWORD_RESET_URL = `${BASE_URL}/api/password_reset/`;
const PASSWORD_CONFIRM_URL = `${BASE_URL}/api/password_reset/confirm/`;

const EMAIL_RESET_URL = `${BASE_URL}/api/users/request_email_change/`;
const EMAIL_VERIFY_URL = `${BASE_URL}/api/users/verify_email_change/`;

export const GET_USER_CARTCODE_URL = `${BASE_URL}/api/users/get_user_cart_code/`;

type Auth = Pick<User, "email" | "password">;
type AuthCart = Auth & { cart_code: string };
type PassConfirm = {
  password: string;
};
type Reset = Pick<User, "email">;
type EmailReset = Reset & { password: string };
type FormSubmitHandler = (formData: EmailReset) => Promise<any>;

// ==================== Register =======================

export const register = async (value: Auth) => {
  const credentials = {
    email: value.email,
    password: value.password,
  };
  try {
    await privateApi.post(REGISTER_URL, credentials);
  } catch (error: any) {
    throw error;
  }
};

// ===================== Login =========================

export const login = async (value: AuthCart) => {
  const credentials = {
    email: value.email,
    password: value.password,
    cart_code: value.cart_code,
  };
  try {
    const response = await privateApi.post(LOGIN_URL, credentials);
    return response;
  } catch (error: any) {
    throw error;
  }
};

// =================== Google Login =======================

// Создаем функцию для отправки Google-данных на бэкенд
export const googleLoginAction = async (
  authResponse: any,
  cartCode: string,
) => {
  const data = {
    access_token: authResponse.access_token, // Токен от Google
    cart_code: cartCode, // Твой cart_code для слияния корзин
  };
  return await privateApi.post("/users/google-auth/", data);
};

// export const login = async (value: Auth) => {
//   // const cartCode = localStorage.getItem("cartcode");
//   const loginData = {
//     email: value.email,
//     password: value.password,
//     // cart_code: cartCode,
//   };
//   try {
//     await privateApi.post(LOGIN_URL, loginData).then((response) => {
//       localStorage.setItem("Token", response.data.token);
//       toast.success("You have been successfully authorized 👋!");
//       // -------- Delay for showing toaster ------------
//       const reloadDelay = () => {
//         window.location.reload();
//       };
//       setTimeout(reloadDelay, 3000);
//     });
//   } catch (error) {
//     console.log("🚀 ~ Register ~ error:", error);
//     toast.error(
//       "Login has failed, please try again, or reset your password 🤚 🚨",
//       { autoClose: 10000, hideProgressBar: true },
//     );
//   }
// };

// ===================== Logout =========================

export const logout = async () => {
  try {
    // 1. Отправляем запрос на бэкенд,
    // чтобы Django удалил токен/сессию у себя
    await privateApi.post(LOGOUT_URL, {});

    localStorage.removeItem("Token");
  } catch (error: any) {
    throw error;
  }
};

// ================== Password Reset ======================

export const passwordResetRequest = async (value: Reset) => {
  try {
    await privateApi.post(PASSWORD_RESET_URL, {
      email: value.email,
    });
  } catch (error: any) {
    throw error;
  }
};

// ================== Password Confirm ======================

export const passwordConfirm = async (value: PassConfirm, token: string) => {
  const credentials = {
    password: value.password,
    token: token,
  };

  try {
    await privateApi.post(PASSWORD_CONFIRM_URL, credentials);
  } catch (error: any) {
    throw error;
  }
};

// ============== Request Email Change =================

export const requestEmailChange: FormSubmitHandler = async (
  value: EmailReset,
) => {
  try {
    const response = await privateApi.post(EMAIL_RESET_URL, {
      new_email: value.email,
      password: value.password,
    });

    return response.data;
  } catch (error: any) {
    throw error;
  }
};

// ============== Verify New Email =================

export const verifyNewEmail = async (token: string) => {
  try {
    await privateApi.post(`${EMAIL_VERIFY_URL}${token}/`);
  } catch (error: any) {
    throw error;
  }
};
