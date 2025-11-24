import { GoogleGenAI } from "@google/genai";
import { ENV } from "./config/env.js"; // adjust path if needed

const genAi = new GoogleGenAI({ apiKey: ENV?.GEMINI_API_KEY });

async function listModels() {
  try {
    const res = await genAi.models.listModels();
    console.log("Available Gemini models:", res);
  } catch (err) {
    console.error("Error listing models:", err);
  }
}

listModels();
