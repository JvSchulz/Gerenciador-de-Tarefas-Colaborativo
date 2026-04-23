import mongoose from "mongoose";
import knexSetup from "knex";
import dotenv from "dotenv";

dotenv.config();

export const db = knexSetup({
  client: "pg",
  connection: {
    user: process.env.PG_USER || "postgres",
    host: process.env.PG_HOST || "localhost",
    database: process.env.PG_DATABASE || "trabalho",
    password: process.env.PG_PASSWORD || "postgres",
    port: process.env.PG_PORT || 5432,
  }
});

export const connectPgDb = async () => {
  try {
    await db.raw("SELECT 1+1 AS result");
    console.log("PostgreSQL connected successfully!");
  } catch (error) {
    console.error("❌ PostgreSQL connection failed:");
    console.error(error.message);
    process.exit(1);
  }
};

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
