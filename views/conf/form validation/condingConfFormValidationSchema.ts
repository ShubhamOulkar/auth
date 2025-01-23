import * as z from "zod";

const ACCEPTED_IMAGE_MIME_TYPES = ["image/png", "image/jpeg", "image/jpg"];
const MAX_FILE_SIZE = 500 * 1024; // bytes

// validate files length
// validate files size
// validate files mime type
export const ImageSchema = z.object({
  picture: z
    .any()
    .refine(
      (imageFile) => imageFile.length > 0,
      "Please select photo for a ticket."
    )
    .refine(
      (imageFile) => ACCEPTED_IMAGE_MIME_TYPES.includes(imageFile[0]?.type),
      "Upload your photo JPG or PNG."
    )
    .refine((imageFile) => {
      return imageFile[0]?.size <= MAX_FILE_SIZE;
    }, "Upload your photo of max size: 500KB."), // if above cond false then return error
});

export const FullNameSchema = z.object({
  fullName: z
    .string()
    .min(1, "Valid full name is required")
    .max(255, "full name must be less than 255 characters")
    .regex(/^[a-zA-Z0-9]+$/, "only letters allowed")
    .trim(),
});

export const EmailSchema = z.object({
  email: z
    .string()
    .min(1, "Valid email is required")
    .email({ message: "Invalid email address" })
    .trim(),
});

export const GithubNameSchema = z.object({
  githubName: z
    .string()
    .min(1, "Valid github username is required.")
    .regex(/^[@][a-zA-Z0-9]+$/, "Invalid username, missing @."),
});

export const CondingConfFormSchema = z.intersection(
  z.intersection(ImageSchema, FullNameSchema),
  z.intersection(EmailSchema, GithubNameSchema)
);
