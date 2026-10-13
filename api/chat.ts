import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';

// In-memory sliding window rate limiter for serverless environment
const requestMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const timestamps = (requestMap.get(ip) || []).filter(t => t > windowStart);

  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  timestamps.push(now);
  requestMap.set(ip, timestamps);
  return true;
}

const RequestSchema = z.object({
  message: z.string().min(1).max(1000),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string()
  })).optional().default([]),
  language: z.enum(['en', 'hi', 'gu']).optional().default('en'),
  clientApiKey: z.string().optional() // Optional override from demo settings
});

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  // Rate Limiting
  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  if (!checkRateLimit(String(clientIp))) {
    return res.status(429).json({
      error: 'Too many requests. Please wait before asking another question.',
      retryAfterSeconds: 60
    });
  }

  // Validation
  const parseResult = RequestSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Invalid request payload',
      details: parseResult.error.errors
    });
  }

  const { message, history, language, clientApiKey } = parseResult.data;

  // Resolve API Key: Server env takes precedence, fallback to client-supplied demo key
  const apiKey = process.env.GEMINI_API_KEY || clientApiKey;
  const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    // If no Gemini key is configured, return flag so client uses local reasoning engine
    return res.status(200).json({
      status: 'fallback_to_local_reasoning',
      message: 'GEMINI_API_KEY is not configured on the server. Utilizing verified local reasoning engine.',
      isGeminiConfigured: false
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1024,
        responseMimeType: "application/json"
      }
    });

    const systemPrompt = `You are the AI Academic & Research Assistant for National Forensic Sciences University (NFSU) Library.
Task: Understand the query, extract search intent into structured JSON, and explain academic strategies in ${language}.

CONSTRAINTS:
1. Do NOT invent bibliographic records or fake metadata.
2. Do NOT claim books are physically in NFSU.
3. Do NOT invent library policies or fines.
4. Output strict JSON:
{
  "intent": "catalogue_search" | "faq_query" | "academic_guidance" | "koha_status" | "citation_help" | "boolean_builder" | "general_help",
  "confidence": 0.95,
  "explanation": "concise guidance in ${language}",
  "searchFilters": {
    "query": "search query",
    "title": "title if any",
    "author": "author if any",
    "yearFrom": 2020
  },
  "suggestedFollowUps": ["Question 1", "Question 2"],
  "relatedKeywords": ["Forensic science keyword"]
}`;

    const contextStr = history.slice(-4).map(h => `${h.role}: ${h.content}`).join('\n');
    const prompt = `${systemPrompt}\n\nContext:\n${contextStr}\n\nUser: "${message}"\n\nJSON:`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 14000);

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });
    clearTimeout(timeoutId);

    const rawText = result.response.text();
    const parsedData = JSON.parse(rawText);

    return res.status(200).json({
      status: 'success',
      data: parsedData,
      isGeminiPowered: true
    });
  } catch (error: any) {
    console.error('Gemini API Error in Serverless Function:', error);
    return res.status(200).json({
      status: 'fallback_to_local_reasoning',
      error: error?.message || 'Gemini processing failed',
      isGeminiConfigured: true,
      message: 'Reverting to local verified reasoning engine.'
    });
  }
}
