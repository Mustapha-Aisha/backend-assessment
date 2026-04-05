import { defineConfig, env } from "prisma/config";
import "dotenv/config";

export default defineConfig({
  schema: "./packages/prisma/schema.prisma",
  // seed: "dist/prisma/seed.js",
  datasource: {
    url: env("DATABASE_URL"),
  },
});