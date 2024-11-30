import z from "zod";

// form validation schema
const LoginFormSchema = z.object({
  email: z
    .string()
    .min(1, "Valid email is required")
    .email({ message: "invalid email address" })
    .trim(),
  // password is invalid if less than 8 characters, do not contain at least a number and special character
  // client only get not valid password error, because hiding password strengths while login
  // but for signup form show error message to the client
  password: z
    .string()
    .min(1, "Valid password is required")
    .min(8, "not valid password")
    .regex(/[a-zA-Z]/, "not valid password")
    .regex(/[0-9]/, "not valid password")
    .regex(/[^a-zA-Z0-9]/, "not valid password"),
});

export default LoginFormSchema;
