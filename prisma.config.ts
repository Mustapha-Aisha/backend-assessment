import 'dotenv/config'; // Automatically loads your .env file
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: './packages/prisma/schema.prisma', 
  datasource: {
    url: process.env.DATABASE_URL || env('DATABASE_URL'),
  }
});
