import OpenAI from "openai";
import axios from "axios";
import dotenv from "dotenv";
import { finalReportPrompt, htmlContentOnly, prompts1 } from "./prompts";
import logger from "./logger";

// Load environment variables from .env file
dotenv.config();

// Initialize OpenAI client with API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Constants for token limits and chunk size
const MAX_TOKENS = 32768; //  Maximum tokens for the o1-preview model
const CHUNK_SIZE = 30000; // Set chunk size to ensure it fits within token limits along with the prompt

/**
 * Generate a consolidated report based on HTML content of a webpage.
 *
 * @param url - The URL of the webpage to fetch HTML content from
 * @returns - The final consolidated report as a JSON object
 */
export const generateCompletionWithWebpage = async (
  url: string
): Promise<any> => {
  // Initialize accumulated context with a system message
  let accumulatedContext: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }> = [
    {
      role: "user",
      content: prompts1(),
    },
  ];

  try {
    // Fetch the HTML content from the provided URL
    const res = await axios.get(url);
    const htmlContent = res.data;

    logger.debug(`HTML content length: ${htmlContent.length}`);

    // Split the HTML content into smaller chunks to fit within token limit
    const chunks = splitIntoChunks(htmlContent, CHUNK_SIZE);
    logger.info(`Number of chunks: ${chunks.length}`);

    // Iterate over each chunk and send it to OpenAI for context building
    for (const chunk of chunks) {
      const chunkPrompt = htmlContentOnly(chunk); // Use the prompts1 function to format the chunk

      const chunkResponse = await openai.chat.completions.create({
        model: "o1-preview",
        messages: [
          ...accumulatedContext,
          {
            role: "user",
            content: `Remember this chunk and analyze it: ${chunkPrompt}`,
          },
        ],
        // max_tokens: MAX_TOKENS, // only for the gpt-4o model
      });

      // Extract the assistant's response for the chunk and add it to the accumulated context
      const assistantResponse = chunkResponse.choices[0].message?.content;
      if (assistantResponse) {
        logger.info(`assistantResponse: ${assistantResponse}`);
        accumulatedContext.push({
          role: "assistant",
          content: assistantResponse,
        });
      }
    }

    // After all chunks are processed, ask for a final consolidated report
    accumulatedContext.push({
      role: "user",
      content: finalReportPrompt(),
    });

    // Request the final consolidated report
    const finalReportResponse = await openai.chat.completions.create({
      model: "o1-preview",
      messages: accumulatedContext,
      // max_tokens: MAX_TOKENS, // only for the gpt-4o model
    });

    // Extract and parse the final report response
    const finalReport = finalReportResponse.choices[0].message?.content;
    try {
      // Attempt to parse the final response as JSON
      const jsonReport = JSON.parse(finalReport || "");
      return jsonReport;
    } catch (error) {
      // Return the raw text if JSON parsing fails
      console.error("Error parsing JSON from final response:", error);
      return finalReport;
    }
  } catch (error) {
    console.error("Error generating completion:", error);
    return "There was an error processing your request.";
  }
};

/**
 * Split a given content into smaller chunks of the specified size.
 *
 * @param content - The content to be split
 * @param chunkSize - The maximum size of each chunk
 * @returns - An array of content chunks
 */
function splitIntoChunks(content: string, chunkSize: number): string[] {
  const chunks = [];
  for (let i = 0; i < content.length; i += chunkSize) {
    chunks.push(content.slice(i, i + chunkSize));
  }
  return chunks;
}

export const listAvailableModels = async () => {
  try {
    const response = await openai.models.list();
    console.log("Available Models:", response.data);
  } catch (error) {
    console.error("Error fetching models:", error);
  }
};
