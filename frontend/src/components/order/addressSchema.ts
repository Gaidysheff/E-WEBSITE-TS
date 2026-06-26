import { z } from "zod";

export const addressSchema = z.object({
  street: z.string().min(3, "address.street_too_short"),
  house: z.string(),
  apartment: z.string(),
  city: z.string().min(2, "address.city_too_short"),
  zip: z.string().regex(/^\+?[1-9]\d{5}$/, "address.zipDigitsOnly"),
  region: z.string(),
  state: z.string().min(2, "address.state_too_short"),

  // phone: z.string().regex(/^\+?[1-9]\d{1,12}$/, "address.invalid_phone"),
  // Простая проверка телефона
});

export type AddressFormValues = z.infer<typeof addressSchema>;
