import { z } from "zod";

export const urlSchema = z.object({
  short_code: z.string().min(6).max(10).optional(), // Allowing it to be optional since it will be auto-generated
  long_url: z.string().url({ message: "Invalid URL format" }),
  clicks: z.number().int().nonnegative().default(0),
});
