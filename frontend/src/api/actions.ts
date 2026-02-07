import {
  ADDRESS_ADD_URL,
  CARTITEM_DELETE_URL,
  CARTITEM_UPDATE_QUANTITY_URL,
  CART_ADD_URL,
  CHECKOUT_URL,
  REVIEW_ADD_URL,
  REVIEW_DELETE_URL,
  REVIEW_UPDATE_URL,
  WISHLIST_ADD_AND_DELETE_URL,
} from "@/api/endpoints.ts";

import api from "@/api/api.ts";
import { toast } from "react-toastify";

// import {
//   CART_DELETE_URL,
//   CART_GET_URL,
//   CART_UPDATE_URL,
//   ORDER_GET_URL,
//   PRODUCT_SEARCH_URL,
// } from "@/api/endpoints.ts";

type FormSubmitHandler = (formData: FormData) => Promise<void>;

type FormSubmitupdateCartItemHandler = (
  formData: FormData,
  productName: string,
) => Promise<void>;

type PaymentHandler = (paymentObject: {
  cart_code: string;
  email: string;
}) => Promise<void>;

type AddressHandler = (addressData: {
  email: string;
  street: string;
  city: string;
  state: string;
  phone: string;
}) => Promise<void>;

// ===================== Add Review =========================

export const createReviewAction: FormSubmitHandler = async (formData) => {
  const product_id = Number(formData.get("product_id"));
  const email = formData.get("email");
  const rating = Number(formData.get("rating"));
  const review = formData.get("review");
  const slug = formData.get("slug");

  if (!product_id || !email || !rating || !review || !slug) {
    toast.error("All fields are required");
    throw new Error("All fields are required");
  }

  const reviewObject = { product_id, email, rating, review };

  // --------------- Fetching delay ----------------------
  // await new Promise((resolve) => setTimeout(resolve, 3000));
  // -----------------------------------------------------

  try {
    await api.post(REVIEW_ADD_URL, reviewObject).then((response) => {
      // console.log("🚀 ~ createReviewAction ~ response:", response);

      if (response?.status === 200) {
        toast.success("Review added successfully!");
      } else {
        toast.error("Something went wrong");
      }
      // ------ Delay for reloading while showing toaster ---------
      const reloadDelay = () => {
        window.location.reload();
      };
      setTimeout(reloadDelay, 3000);

      return response;
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occured");
  }
};

// ===================== Update Review =========================

export const updateReviewAction: FormSubmitHandler = async (formData) => {
  const rating = Number(formData.get("rating"));
  const review = formData.get("review");
  const review_id = formData.get("review_id");

  const reviewObject = { rating, review };

  try {
    await api
      .put(`${REVIEW_UPDATE_URL}${review_id}/`, reviewObject)
      .then((response) => {
        // console.log("🚀 ~ updateReviewAction ~ review_id:", review_id);
        // console.log("🚀: updateReviewAction -> Response", response);
        if (response?.status === 200) {
          toast.success("Review updated successfully!");
        } else {
          toast.error("Something went wrong");
        }
        // ------ Delay for reloading while showing toaster ---------
        const reloadDelay = () => {
          window.location.reload();
        };
        setTimeout(reloadDelay, 3000);

        return response;
      });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occured");
  }
};

// ===================== Delete Review =========================

export const deleteReviewAction: FormSubmitHandler = async (formData) => {
  const review_id = formData.get("review_id");

  try {
    await api.delete(`${REVIEW_DELETE_URL}${review_id}/`).then((response) => {
      toast.warning("Review deleted successfully!");

      // ------ Delay for reloading while showing toaster ---------
      const reloadDelay = () => {
        window.location.reload();
      };
      setTimeout(reloadDelay, 3000);

      return response;
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occured");
  }
};

// ===================== Add to Cart =========================

export const addToCartAction: FormSubmitHandler = async (formData) => {
  const product_id = formData.get("product_id");
  const cart_code = formData.get("cart_code");

  const cartObject = { product_id, cart_code };

  // --------------- Fetching delay ----------------------
  // await new Promise((resolve) => setTimeout(resolve, 4000));
  // -----------------------------------------------------

  try {
    await api.post(CART_ADD_URL, cartObject).then((response) => {
      if (response?.status === 200) {
        toast.success("Selected item added successfully!");
      } else {
        toast.error("Something went wrong");
      }

      // ------ Delay for reloading while showing toaster ---------
      const reloadDelay = () => {
        window.location.reload();
      };
      setTimeout(reloadDelay, 3000);

      return response;
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occured");
  }
};

// // ===================== is Product in Cart =========================

// export const isProductInCartAction = async () => {
//   try {
//     await api.get(CART_PRODUCT_ADDED_URL).then((response) => {
//       return response;
//     });
//   } catch (error) {
//     if (error instanceof Error) {
//       throw new Error(error.message);
//     }
//     throw new Error("An unknown error occured");
//   }
// };

// ================== Update CartItem Quantity ====================

export const updateCartItemAction: FormSubmitupdateCartItemHandler = async (
  formData,
  productName,
) => {
  const item_id = Number(formData.get("cartitem_id"));
  const quantity = Number(formData.get("quantity"));

  const cartObject = { item_id, quantity };

  try {
    await api.put(CARTITEM_UPDATE_QUANTITY_URL, cartObject).then((response) => {
      // console.log("🚀 ~ updateCartItemAction ~ response:", response);

      if (typeof response !== "undefined") {
        toast.success(`Item - ${productName}'s quantity has been updated`, {
          autoClose: 2000,
        });
      } else {
        toast.error("Something went wrong");
      }

      return response;
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occured");
  }
};

// ================ Delete CartItem from the Cart =================

export const deleteCartItemAction: FormSubmitupdateCartItemHandler = async (
  formData,
  productName,
) => {
  const item_id = Number(formData.get("item_id"));

  try {
    await api.delete(`${CARTITEM_DELETE_URL}${item_id}/`).then((response) => {
      // console.log("🚀 ~ updateCartItemAction ~ response:", response);

      if (typeof response !== "undefined") {
        toast.success(`Item - ${productName}'s quantity has been updated`, {
          autoClose: 2000,
        });
      } else {
        toast.error("Something went wrong");
      }
      return response;
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occured");
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
  const product_id = formData.get("product_id");
  const email = formData.get("email");

  const wishObject = { product_id, email };

  try {
    await api.post(WISHLIST_ADD_AND_DELETE_URL, wishObject).then((response) => {
      return response;
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occured");
  }
};

// =================== CHECKOUT SESSION ======================

export const initiatePaymentAction: PaymentHandler = async (paymentObject) => {
  try {
    await api.post(CHECKOUT_URL, paymentObject).then((response) => {
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

// // =================== Get Orders ======================
// export const getOrdersAction = async (email) => {
//   if (email) {
//     // --------------- Fetching delay ----------------------
//     // await new Promise((resolve) => setTimeout(resolve, 4000));
//     // -----------------------------------------------------
//     await api.get(`${ORDER_GET_URL}${email}`).then((response) => {
//       return response;
//     });
//   }
// };

// =================== Add Address ======================

export const addAddressAction: AddressHandler = async (addressData) => {
  // --------------- Fetching delay ----------------------
  // await new Promise((resolve) => setTimeout(resolve, 4000));
  // -----------------------------------------------------
  try {
    await api.post(ADDRESS_ADD_URL, addressData).then((response) => {
      // console.log("🚀 ~ addAddressAction ~ response:", response);
      if (response?.status === 200) {
        toast.success("Your shipping address has been saved!");
      } else {
        toast.error("Something went wrong");
      }
      return response;
    });
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
      throw new Error(error.message);
    }
    toast.error("An unknown error occured");
    throw new Error("An unknown error occured");
  }
};
