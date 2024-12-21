import z from "zod";

// password field schema
const PasswordSchema = z.object({
  password: z
    .string()
    .min(1, "Valid password is required")
    .regex(/[a-zA-Z]/, "must contain capital letter")
    .regex(/[0-9]/, "must contain numbers")
    .regex(/[^a-zA-Z0-9]/, "must contain special characters")
    .min(8, "must be 8 character long")
    .trim(),
});

const ConfirmPasswordSchema = z.object({
  confirmPassword: z.string().min(1, "Valid password is required").trim(),
});

const LastNameSchema = z.object({
  lastName: z
    .string()
    .min(1, "Valid last name is required")
    .max(255, "Name cannot be more than 255 characters")
    .regex(/^[a-zA-Z]+$/, "only letters allowed")
    .trim(),
});

const FirstNameSchema = z.object({
  firstName: z
    .string()
    .min(1, "Valid name is required")
    .max(255, "Name cannot be more than 255 characters")
    .regex(/^[a-zA-Z]+$/, "only letters allowed")
    .trim(),
});

// form validation schema
const SignupFormSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "Valid name is required")
      .max(255, "Name cannot be more than 255 characters")
      .regex(/^[a-zA-Z]+$/, "only letters allowed")
      .trim(),
    lastName: z
      .string()
      .min(1, "Valid last name is required")
      .max(255, "Name cannot be more than 255 characters")
      .regex(/^[a-zA-Z]+$/, "only letters allowed")
      .trim(),
    email: z
      .string()
      .min(1, "Valid email is required")
      .email({ message: "invalid email address" })
      .trim(),
    password: z
      .string()
      .min(1, "Valid password is required")
      .regex(/[a-zA-Z]/, "must contain capital letter")
      .regex(/[0-9]/, "must contain numbers")
      .regex(/[^a-zA-Z0-9]/, "must contain special characters")
      .min(8, "must be 8 character long")
      .trim(),
    confirmPassword: z.string().min(1, "Valid password is required").trim(),
  })
  .refine(async (data) => data.confirmPassword === data.password, {
    message: "password is not matched",
    path: ["confirmPassword"],
  });

export {
  PasswordSchema,
  ConfirmPasswordSchema,
  SignupFormSchema,
  LastNameSchema,
  FirstNameSchema,
};
