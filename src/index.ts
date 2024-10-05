import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import logger from "./logger";
import {
  generateCompletionWithWebpage,
  listAvailableModels,
} from "./openaiService"; // Import the OpenAI service

// Configure dotenv to load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to log incoming requests
app.use((req: Request, res: Response, next) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Middleware to parse JSON requests
app.use(express.json());

// Define a route to interact with OpenAI
app.post("/openai", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { url } = req.body;
    logger.info(url);

    if (!url) {
      res.status(400).json({ error: "url is required" });
      next();
    }

    const completion = await generateCompletionWithWebpage(url);

    res.json({ completion });
  } catch (error) {
    next(error); // Pass errors to Express error handler
  }
});

// Define a simple root route
app.get("/", (req: Request, res: Response) => {
  logger.info("GET / request received");
  res.send("Hello, TypeScript with Express, pnpm, dotenv, and OpenAI!");
});

// Start the server
app.listen(port, () => {
  logger.info(`Server running at http://localhost:${port}`);
  // listAvailableModels();
});
