import { z } from "zod";

export const addressSchema = z.object({
  street: z.string().min(3, "street_too_short"),
  city: z.string().min(2, "city_too_short"),
  state: z.string().min(2, "state_too_short"),
  phone: z.string().regex(/^\+?[1-9]\d{1,12}$/, "invalid_phone"), // Простая проверка телефона
});

export type AddressFormValues = z.infer<typeof addressSchema>;
