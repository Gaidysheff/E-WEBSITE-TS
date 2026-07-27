import {
  ADDRESS_ADD_URL,
  CARTITEM_DELETE_URL,
  CARTITEM_UPDATE_QUANTITY_URL,
  CART_ADD_URL,
  CART_PRODUCT_ADDED_URL,
  CHECKOUT_URL,
  CLOUD_PAYMENTS_URL,
  CURRENT_USER_DATA_URL,
  DELIVERY_OPTIONS_URL,
  REVIEW_ADD_URL,
  REVIEW_DELETE_URL,
  REVIEW_UPDATE_URL,
  WISHLIST_ADD_AND_DELETE_URL,
  WISHLIST_PRODUCT_ADDED_URL,
} from "@/api/endpoints.ts";
import type { CPResponse, PureAddress } from "@/lib/types";

import privateApi from "@/api/api.ts";
import { publicApi } from "@/api/api.ts";

import { type UserInfoFormValues } from "@/components/profile/userInfoSchema";

type FormSubmitHandler = (formData: FormData) => Promise<any>;

type PaymentHandler = (paymentObject: {
  cart_code: string;
  email: string;
}) => Promise<void>;

type AddressHandler = (addressData: {
  email: string;
  street: string;
  house: string;
  apartment: string;
  city: string;
  zip: string;
  region: string;
  state: string;
}) => Promise<PureAddress>;

type UserInfoHandler = (userData: {
  username: string;
  birthday: string | null;
  firstName: string;
  lastName: string;
  phone: string;
  image?: any;
}) => Promise<{
  username: string;
  birthday: string;
  first_name: string;
  last_name: string;
  phone: string;
  image?: any;
}>;
// }) => Promise<UserInfoFormValues>;

type CloudPaymentsHandler = (paymentData: {
  amount: number;
  currency: string;
  name: string;
  cryptogram: string;
  invoiceId: string;
  description: string;
}) => Promise<CPResponse>;

export type IsProductInCartType = (
  cartCode: string,
  productName: string,
) => Promise<any>;

export type IsProductInWishlistType = (
  email: string,
  productId: number,
) => Promise<any>;

// ===================== Add Review =========================

export const createReviewAction: FormSubmitHandler = async (formData) => {
  const reviewObject = {
    product_id: Number(formData.get("product_id")),
    email: formData.get("email"),
    rating: Number(formData.get("rating")),
    review: formData.get("review"),
  };

  // --------------- Fetching delay ----------------------
  // await new Promise((resolve) => setTimeout(resolve, 3000));
  // -----------------------------------------------------

  try {
    const response = await privateApi.post(REVIEW_ADD_URL, reviewObject);
    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

// ===================== Update Review =========================

export const updateReviewAction: FormSubmitHandler = async (formData) => {
  const review_id = formData.get("review_id");

  const reviewObject = {
    rating: Number(formData.get("rating")),
    review: formData.get("review"),
  };

  try {
    const response = await privateApi.put(
      `${REVIEW_UPDATE_URL}${review_id}/`,
      reviewObject,
    );

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

// ===================== Delete Review =========================

export const deleteReviewAction: FormSubmitHandler = async (formData) => {
  const review_id = formData.get("review_id");

  try {
    const response = await privateApi.delete(
      `${REVIEW_DELETE_URL}${review_id}/`,
    );
    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

// ===================== Add to Cart =========================
export const addToCartAction: FormSubmitHandler = async (formData) => {
  const cartObject = {
    product_id: formData.get("product_id"),
    cart_code: formData.get("cart_code"),
  };

  // --------------- Fetching delay ----------------------
  // await new Promise((resolve) => setTimeout(resolve, 4000));
  // -----------------------------------------------------

  try {
    const response = await privateApi.post(CART_ADD_URL, cartObject);
    return response;
  } catch (error: any) {
    throw error;
  }
};

// ===================== is Product in Cart =========================

export const isProductInCartAction: IsProductInCartType = async (
  cartCode,
  productId,
) => {
  try {
    const response = await privateApi.get(
      `${CART_PRODUCT_ADDED_URL}?cart_code=${cartCode}&product_id=${productId}`,
    );
    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

// ================== Update CartItem Quantity ====================

export const updateCartItemAction: FormSubmitHandler = async (formData) => {
  const cartObject = {
    item_id: Number(formData.get("cartitem_id")),
    quantity: Number(formData.get("quantity")),
  };

  try {
    const response = await privateApi.put(
      CARTITEM_UPDATE_QUANTITY_URL,
      cartObject,
    );
    return response;
  } catch (error: any) {
    throw error;
  }
};

// ================ Delete CartItem from the Cart =================

export const deleteCartItemAction: FormSubmitHandler = async (formData) => {
  const item_id = Number(formData.get("item_id"));

  try {
    const response = await privateApi.delete(
      `${CARTITEM_DELETE_URL}${item_id}/`,
    );
    return response;
  } catch (error) {
    throw new Error("Failed to delete item");
  }
};

// ===================== Get Cart =========================

// export const getCartAction = async (cart_code) => {
//   try {
//     await api.get(`${CART_GET_URL}${cart_code}`).then((response) => {
//       console.log("🚀 ~ getCartAction ~ Response:", response);
//       return response;
//     });
//   } catch (error) {
//     if (error instanceof Error) {
//       throw new Error(error.message);
//     }
//     throw new Error("An unknown error occured");
//   }
// };

// =================== WishList - Add & Delete ======================

export const wishlistAddAndDeleteAction: FormSubmitHandler = async (
  formData,
) => {
  const wishObject = {
    product_id: formData.get("product_id"),
    email: formData.get("email"),
  };

  try {
    const response = await privateApi.post(
      WISHLIST_ADD_AND_DELETE_URL,
      wishObject,
    );
    return response;
  } catch (error: any) {
    throw error;
  }
};

// ======== WishList - Is the Product in the WishList ? ==========

export const isProductInWishlistAction: IsProductInWishlistType = async (
  email,
  productId,
) => {
  try {
    const response = await privateApi.get(
      `${WISHLIST_PRODUCT_ADDED_URL}?email=${email}&product_id=${productId}`,
    );
    return response;
  } catch (error: any) {
    throw error;
  }
};

// =================== CHECKOUT SESSION ======================

export const initiatePaymentAction: PaymentHandler = async (paymentObject) => {
  try {
    await privateApi.post(CHECKOUT_URL, paymentObject).then((response) => {
      window.location.href = response.data.data.url;

      // console.log("🚀 ~ initiatePaymentAction ~ response:", response);
      // // ------ Delay for loading --------
      // const reloadDelay = () => {
      //   window.location.href = response.data.data.url;
      // };
      // setTimeout(reloadDelay, 70000);
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occured");
  }
};

// =================== Get Orders ======================
// export const getOrdersAction = async (email) => {
//   if (email) {
//     // --------------- Fetching delay ----------------------
//     // await new Promise((resolve) => setTimeout(resolve, 4000));
//     // -----------------------------------------------------
//     await privateApi.get(`${ORDER_GET_URL}${email}`).then((response) => {
//       return response;
//     });
//   }
// };

// =================== Add Address ======================

export const addAddressAction: AddressHandler = async (
  addressData: PureAddress,
) => {
  try {
    const response = await privateApi.post(ADDRESS_ADD_URL, addressData);
    return response.data; // ВОЗВРАЩАЕМ ДАННЫЕ
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

// =================== Add User's Info ======================

export const addUserInfoAction: UserInfoHandler = async (
  userData: any,
  // userData: UserInfoFormValues,
) => {
  const formData = new FormData();

  // Раскладываем все поля формы в FormData
  Object.keys(userData).forEach((key) => {
    if (userData[key] !== undefined && userData[key] !== null) {
      formData.append(key, userData[key]);
    }
  });

  try {
    // Axios автоматически выставит 'Content-Type': 'multipart/form-data'
    const response = await privateApi.put(CURRENT_USER_DATA_URL, formData);

    // const response = await privateApi.put(CURRENT_USER_DATA_URL, userData);
    console.log("🚀 ~ addUserInfoAction ~ response:", response);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

// =================== CloudPayments (CP) ======================

export const paymentActionCP: CloudPaymentsHandler = async (paymentData) => {
  try {
    const response = await privateApi.post(CLOUD_PAYMENTS_URL, paymentData);
    return response.data; // Возвращаем данные от Django (Success: true и т.д.)
  } catch (error: any) {
    // Чтобы в будущем не гадать, выводим реальную ошибку запроса в консоль
    console.error(
      "Ошибка внутри paymentActionCP:",
      error?.response?.data || error.message,
    );
    throw error;
    // throw new Error(
    //   error.response?.data?.message || "An unknown error occured",
    // );
  }
};

// ================= get Delivery Options ====================

export const getDeliveryOptionsAction = async () => {
  try {
    const response = await publicApi.get(DELIVERY_OPTIONS_URL);
    return response;
  } catch (error: any) {
    throw error;
  }
};
