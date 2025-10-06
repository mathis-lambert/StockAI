import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Centralised runtime environment validation to catch configuration issues
 * during application boot instead of failing deep within business logic.
 */
export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required"),
    NEXTAUTH_URL: z.string().url().optional(),
    MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
    MONGODB_DB_NAME: z.string().min(1, "MONGODB_DB_NAME is required"),
    MONGODB_ROOT_USERNAME: z.string().optional(),
    MONGODB_ROOT_PASSWORD: z.string().optional(),
  },
  client: {},
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DB_NAME: process.env.MONGODB_DB_NAME,
    MONGODB_ROOT_USERNAME: process.env.MONGODB_ROOT_USERNAME,
    MONGODB_ROOT_PASSWORD: process.env.MONGODB_ROOT_PASSWORD,
  },
  /**
   * Allow skipping validation in environments like CI where env vars are
   * stubbed or injected at runtime.
   */
  skipValidation: Boolean(process.env.SKIP_ENV_VALIDATION),
  emptyStringAsUndefined: true,
});
