import { z } from "zod";

export const userInfoSchema = z.object({
  username: z.string(),

  birthday: z
    .string()
    .or(z.literal(""))
    .transform((val) => (val === "" ? null : val)),

  image: z.any().optional(),
  firstName: z.string(),
  lastName: z.string(),
  // firstName: z.string().min(2, "___"),
  // lastName: z.string().min(2, "___"),
  // phone: z.string(),
  phone: z.string(),
  // phone: z.string().regex(/^\+?[1-9]\d{1,10}$/, "address.invalid_phone"),
  // Пока простая проверка телефона
});

export type UserInfoFormValues = z.infer<typeof userInfoSchema>;
