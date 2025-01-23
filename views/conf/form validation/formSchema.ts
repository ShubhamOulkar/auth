import * as z from "zod";

export const NameSchema = z.object({
  name: z.string().min(1, { message: "Required" }),
});

export const AgeSchema = z.object({
  age: z.number().min(10),
});

export const Schema = z.intersection(NameSchema, AgeSchema);
