import OpenAI from "openai";
import axios from "axios"; // Import axios to fetch webpage

import dotenv from "dotenv";
import { prompts, prompts1 } from "./prompts";
import logger from "./logger";

// Load environment variables
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Fetch the HTML content of a webpage and append it to the prompt for OpenAI completion.
//  * @param prompt - The prompt to send to OpenAI
 * @param url - The URL of the webpage to fetch HTML from
 * @returns - The completion response from OpenAI
 */
export const generateCompletionWithWebpage = async (
  url: string
): Promise<any> => {
  let toJson = "";
  try {
    // Fetch the HTML content of the webpage
    const res = await axios.get(url);
    const htmlContent = res.data;

    logger.debug(htmlContent.length);
    logger.debug(htmlContent.length);

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Specify the model
      messages: [{ role: "user", content: prompts1(htmlContent) }],
      max_tokens: 4095, // Limit the response length
    });

    const completion = response.choices[0].message.content;
    if (completion) {
      try {
        toJson = JSON.parse(completion); 
      } catch (error) {
        toJson = completion;
      }
    }
    return completion ? toJson : "";
    // return {
    //   htmlContent: htmlContent.length,
    //   prompts: prompts.length,
    //   prompts1: prompts.length,
    //   total: htmlContent.length + prompts1.length,
    //   exx: 4095 - htmlContent.length + prompts1.length,
    // };
  } catch (error) {
    console.error("Error generating completion:", error);
    return "There was an error processing your request.";
  }
};
