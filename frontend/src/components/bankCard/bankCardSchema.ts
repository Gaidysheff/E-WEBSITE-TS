import { z } from "zod";

export const bankCardSchema = z.object({
  cardNumber: z
    .string()
    .regex(/^\d+$/, { message: "number must contain only digits" })
    .refine((val) => val.length === 16 || val.length === 19, {
      message: "Must be 16 or 19 digits",
    }),
  userName: z
    .string()
    .min(1, { message: "Name is required" })
    .min(2, { message: "Name must be at least 2 characters" })
    .regex(/^[a-zA-Z\s]+$/, "String must contain only Latin letters"),
  month: z.string().min(1),
  year: z.string().min(4),
  cvc: z
    .string()
    .regex(/^\d+$/, { message: "cvc must contain only digits" })
    .length(3, "CVC must be 3 digits"),
});

// Optional: Infer the TypeScript type from the schema for full type safety
export type BankCardSchemaType = z.infer<typeof bankCardSchema>;
