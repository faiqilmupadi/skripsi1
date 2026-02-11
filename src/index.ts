import { checkDatabaseConnection } from "./config/database";

async function bootstrap(): Promise<void> {
  await checkDatabaseConnection();
  console.log("Database connected successfully.");
}

bootstrap().catch((error) => {
  console.error("Failed to connect database:", error.message);
  process.exit(1);
});
