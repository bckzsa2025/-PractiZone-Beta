/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { GoogleGenAI } from "@google/genai";

// Initialize exclusively from environment variables.
// Note: Vite uses import.meta.env, not process.env
// Fix: Cast import.meta to any to resolve TypeScript error 'Property env does not exist on type ImportMeta'
const API_KEY = (import.meta as any).env?.VITE_GOOGLE_API_KEY || '';
const ai = new GoogleGenAI({ apiKey: API_KEY });

// Default models configuration
const models = {
    chat: 'gemini-2.5-flash',
    image: 'gemini-2.5-flash-image',
    video: 'veo-3.1-fast-generate-preview',
    audio: 'gemini-2.5-flash-native-audio-preview-09-2025'
};

/**
 * Chat with Gemini (Text)
 */
export const chatWithGemini = async (message: string, systemInstruction?: string) => {
  try {
    const response = await ai.models.generateContent({
      model: models.chat,
      contents: message,
      config: {
        systemInstruction: systemInstruction || "You are a helpful medical practice assistant for Dr. Setzer. You can answer general questions about hours, location, and services. Do not provide medical advice.",
        tools: [{ googleSearch: {} }]
      }
    });

    const text = response.text || "I'm sorry, I couldn't generate a response.";
    
    // Extract Grounding Metadata
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .map((chunk: any) => chunk.web)
      .filter((web: any) => web)
      .map((web: any) => ({
        title: web.title || "Source",
        uri: web.uri || "#"
      }));

    return {
      text,
      sources
    };

  } catch (error: any) {
    console.error("AI Chat Error:", error);
    throw new Error("AI Service Error: " + (error.message || "Unknown error"));
  }
};

/**
 * Generate Image
 */
export const generateImage = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: models.image,
      contents: prompt,
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error: any) {
    console.error("AI Image Gen Error:", error);
    throw new Error("Failed to generate image: " + error.message);
  }
};

/**
 * Generate Educational Video (Veo)
 */
export const generateMedicalVideo = async (prompt: string): Promise<string | null> => {
  try {
    console.log(`Starting Video Gen for:`, prompt);

    let operation = await ai.models.generateVideos({
      model: models.video,
      prompt: `Educational medical animation, realistic, high quality, clear, 1080p: ${prompt}`,
      config: {
        numberOfVideos: 1,
        resolution: '1080p',
        aspectRatio: '16:9'
      }
    });

    // Poll for completion
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
      operation = await ai.operations.getVideosOperation({operation: operation});
      console.log("Video Gen Status:", operation.metadata);
    }

    if (operation.error) {
      throw new Error(String(operation.error.message));
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (videoUri) {
      // Use API KEY directly for the binary fetch
      const fetchResponse = await fetch(`${videoUri}&key=${API_KEY}`);
      const blob = await fetchResponse.blob();
      return URL.createObjectURL(blob);
    }

    return null;
  } catch (error: any) {
    console.error("AI Video Gen Error:", error);
    throw new Error("Failed to generate video: " + error.message);
  }
};