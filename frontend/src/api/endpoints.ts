// import api from "@/api/api";

import { env } from "@/lib/env";

const BASE_URL = env.VITE_API_URL;

export const USERS_URL = `${BASE_URL}/users/users/`;
export const CURRENT_USER_URL = `${BASE_URL}/users/current-user/`;
export const CATEGORY_LIST_URL = `${BASE_URL}/api/category_list/`;
export const CATEGORY_DETAIL_PAGE_URL = `${BASE_URL}/api/categories/`;

export const FEATURED_PRODUCT_LIST_URL = `${BASE_URL}/api/featured_product_list/`;
export const PRODUCTS_IN_CAROUSEL_URL = `${BASE_URL}/api/products_for_carousel/`;
export const PRODUCT_DETAIL_PAGE_URL = `${BASE_URL}/api/products/`;
export const PRODUCT_SEARCH_URL = `${BASE_URL}/api/search?query=`;

export const REVIEW_ADD_URL = `${BASE_URL}/api/add_review/`;
export const REVIEW_UPDATE_URL = `${BASE_URL}/api/update_review/`;
export const REVIEW_DELETE_URL = `${BASE_URL}/api/delete_review/`;

export const WISHLIST_ADD_AND_DELETE_URL = `${BASE_URL}/api/add_to_wishlist/`;
export const WISHLIST_PRODUCT_ADDED_URL = `${BASE_URL}/api/product_in_wishlist`;
export const WISHLISTS_GET_URL = `${BASE_URL}/api/my_wishlists?email=`;

export const CART_ADD_URL = `${BASE_URL}/api/add_to_cart/`;
export const CART_PRODUCT_ADDED_URL = `${BASE_URL}/api/product_in_cart`;
// export const CART_NUMBER_OF_ITEMS_URL = `${BASE_URL}/api/get_cart_stat`;
export const CART_UPDATE_URL = `${BASE_URL}/api/update_cart/`;
export const CART_DELETE_URL = `${BASE_URL}/api/delete_cart/`;
// export const CART_GET_URL = `${BASE_URL}/api/get_cart/`;

export const CARTITEM_UPDATE_QUANTITY_URL = `${BASE_URL}/api/update_cartitem_quantity/`;
export const CARTITEM_DELETE_URL = `${BASE_URL}/api/delete_cartitem/`;

export const CARTITEMS_WITH_TOTAL_URL = `${BASE_URL}/api/cart_items_with_total/`;

export const ADDRESS_ADD_URL = `${BASE_URL}/api/add_address/`;
export const ADDRESS_GET_URL = `${BASE_URL}/api/get_address?email=`;

export const DELIVERY_OPTIONS_URL = `${BASE_URL}/api/delivery_options/`;

export const CHECKOUT_URL = `${BASE_URL}/api/create_checkout_session/`;

export const ORDER_GET_URL = `${BASE_URL}/api/get_orders?email=`;

export const CLOUD_PAYMENTS_URL = `${BASE_URL}/api/process_from_cloud_payments/`;

// ======================= API Requests =================================

// export const getCategories = async () => {
//   try {
//     await api.get(CATEGORY_LIST_URL).then((response) => {
//       console.log("🚀 ~ getCategories ~ RESP:", response.data);
//       return response.data;
//     });
//   } catch (error) {
//     if (error instanceof Error) {
//       throw new Error(error.message);
//     }
//     throw new Error("an unknown error occurred");
//   }
// };

// export const getFeaturedProducts = async () => {
//   try {
//     const response = await api.get(FEATURED_PRODUCT_LIST_URL);
//     return response.data;
//   } catch (error) {
//     if (error instanceof Error) {
//       throw new Error(error.message);
//     }
//     throw new Error("an unknown error occurred");
//   }
// };
