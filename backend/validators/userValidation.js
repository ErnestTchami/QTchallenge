import { z } from "zod";

export const userSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters").max(50, "Username too long"),
    email: z.string().email("Invalid email format"),
    password_hash: z.string().min(6, "Password must be at least 6 characters"),
    refreshToken: z.string().optional(),
});
