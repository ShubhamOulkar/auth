import z from "zod";

// verify email form validation schema
const FaEmailSchema = z.object({
  email: z
    .string()
    .min(1, "Valid email is required")
    .email({ message: "invalid email address" })
    .trim(),
});

// reset password form validation schema
const FaPasswordResetSchema = z
  .object({
    password: z
      .string()
      .min(1, "Valid password is required")
      .min(8, "must be 8 character long")
      .regex(/[a-zA-Z]/, "must contain capital letter")
      .regex(/[0-9]/, "must contain numbers")
      .regex(/[^a-zA-Z0-9]/, "must contain special characters")
      .trim(),
    confirmPassword: z.string().min(1, "Valid password is required").trim(),
  })
  .refine(async (data) => data.confirmPassword === data.password, {
    message: "password is not matched",
    path: ["confirmPassword"],
  });

export { FaEmailSchema, FaPasswordResetSchema };
