import * as z from "zod";

export const urlSchema = z.object({
  originalUrl: z.string().url("Please enter a valid URL"),
});

export type UrlFormValues = z.infer<typeof urlSchema>;
