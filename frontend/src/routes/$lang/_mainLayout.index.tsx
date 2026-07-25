import { PRODUCTS_IN_CAROUSEL_URL } from "@/api/endpoints.ts";
import api from "@/api/api.ts";
import axios from "axios";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$lang/_mainLayout/")({
  // loader: async () => {
  //   // ---------- get Products for Carousel ----------
  //   try {
  //     const response = await api.get(`${PRODUCTS_IN_CAROUSEL_URL}`);
  //     return {
  //       productsForCarousel: response?.data,
  //     };
  //   } catch (error: any) {
  //     throw error;
  //   }
  // },
  loader: async () => {
    try {
      // Обязательно добавляем await и сохраняем в переменную
      const response = await axios.get("https://e-shop-ts-back.onrender.com");
      console.log("Данные успешно получены:", response.data);

      // СТРОГО ОБЯЗАТЕЛЬНО возвращаем данные для useLoaderData()
      return response.data;
    } catch (err) {
      console.error("Ошибка запроса внутри лоадера:", err);
      // Возвращаем пустой массив или null, чтобы компонент не падал при ошибке
      return [];
    }
  },
});
