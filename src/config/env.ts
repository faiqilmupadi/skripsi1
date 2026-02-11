import dotenv from "dotenv";

dotenv.config();

const requiredVars = ["DB_PORT", "DB_USER", "DB_NAME", "JWT_SECRET"] as const;

type RequiredEnvVar = (typeof requiredVars)[number];

function getRequiredEnv(name: RequiredEnvVar): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getPort(): number {
  const rawPort = getRequiredEnv("DB_PORT");
  const parsed = Number(rawPort);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error("DB_PORT must be a positive integer");
  }

  return parsed;
}

export type AppEnv = {
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  JWT_SECRET: string;
};

export const env: AppEnv = {
  DB_HOST: process.env.DB_HOST ?? "localhost",
  DB_PORT: getPort(),
  DB_USER: getRequiredEnv("DB_USER"),
  DB_PASSWORD: process.env.DB_PASSWORD ?? "",
  DB_NAME: getRequiredEnv("DB_NAME"),
  JWT_SECRET: getRequiredEnv("JWT_SECRET")
};
