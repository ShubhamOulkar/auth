import { LoginFormSchema } from "../validation/loginFormSchema";
import SignupFormSchema from "../validation/signupFormSchema";
import z from "zod";

// define login form fields
export type LoginInputs = z.infer<typeof LoginFormSchema>;

// define signup form fields
export type SignupInputs = z.infer<typeof SignupFormSchema>;
