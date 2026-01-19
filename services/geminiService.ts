
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Recording } from "../types";

export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data:audio/xxx;base64, prefix
      resolve(base64String.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const summarizeLesson = async (recordings: Recording[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const audioParts = await Promise.all(
    recordings.map(async (rec) => {
      const base64 = await blobToBase64(rec.blob);
      return {
        inlineData: {
          mimeType: rec.blob.type,
          data: base64,
        },
      };
    })
  );

  const prompt = `
    You are an expert golf coach. You have been provided with multiple audio recordings from a golf lesson.
    Your task is to:
    1. Listen to all segments and transcribe the key coaching points.
    2. Provide a structured summary of the lesson.
    3. List specific drills that were mentioned or recommended.
    4. Highlight the "Feel vs Real" adjustments if any were discussed.
    
    Format the output using Markdown. Use headers for different sections.
  `;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        ...audioParts,
        { text: prompt }
      ]
    },
    config: {
      thinkingConfig: { thinkingBudget: 0 }
    }
  });

  return response.text || "Failed to generate summary.";
};
