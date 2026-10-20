import express from "express";
import { apiRouter } from "../server/routes";

const app = express();
app.use(express.json());

// Mount API router
app.use("/api", apiRouter);

// Export for Vercel Serverless Function handler
export default app;
