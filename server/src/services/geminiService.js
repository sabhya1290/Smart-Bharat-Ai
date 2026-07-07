import { GoogleGenerativeAI } from '@google/generative-ai';
import { env, isGeminiConfigured } from '../config/env.js';
import { CIVIC_ASSISTANT_SYSTEM_PROMPT, buildUserPrompt } from '../prompts/systemPrompt.js';
import { getMockAiResponse } from './mockAiResponses.js';

let client = null;
if (isGeminiConfigured()) {
  client = new GoogleGenerativeAI(env.geminiApiKey);
}

const extractJson = (text) => {
  const fencedMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fencedMatch ? fencedMatch[1] : text;
  return JSON.parse(candidate.trim());
};

export const askCivicAssistant = async (message, language = 'en') => {
  if (!client) {
    return { ...getMockAiResponse(message), source: 'mock' };
  }

  try {
    const model = client.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: CIVIC_ASSISTANT_SYSTEM_PROMPT,
    });

    const result = await model.generateContent(buildUserPrompt(message, language));
    const text = result.response.text();
    const parsed = extractJson(text);

    return { ...parsed, source: 'gemini' };
  } catch (err) {
    console.warn('[geminiService] Falling back to mock response:', err.message);
    return { ...getMockAiResponse(message), source: 'mock' };
  }
};
