import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf, colorize } = format;

// Custom format for human-readable logging
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Create a logger instance
const logger = createLogger({
  format: combine(
    colorize(), // Colorize logs for console
    timestamp(), // Add timestamp to each log
    logFormat // Use custom log format
  ),
  transports: [
    new transports.Console(), // Log to the console
    new transports.File({ filename: "logs/app.log" }), // Log to a file
  ],
});

export default logger;
