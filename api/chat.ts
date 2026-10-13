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
Task: Understand the query, answer using official NFSU library rules, extract search intent into structured JSON, and explain academic strategies in ${language}.

OFFICIAL NFSU LIBRARY RULES & TIMINGS (FROM catalog.nfsu.ac.in):
1. LIBRARY HOURS: Reading halls open 9:30 AM to 8:00 PM on all working days. Circulation desk (Issue/Return/Renew): 10:00 AM to 6:00 PM. Digital library: 24x7 via campus network and INFED IDP (idp.nfsu.edu.in).
2. BORROWING LIMITS: Faculty: 10 books, PhD: 6 books, PG Students (M.Tech/M.Sc): 4 books, UG Students: 3 books.
3. FINES & LOST BOOKS: Books must be returned on or before due date to avoid daily overdue fines. Lost books MUST be replaced with a new copy of same/latest edition, OR pay current market price + Rs. 100/- processing fee. Strict rule against cash arguments with staff without following this protocol. Damaging books leads to disciplinary action.
4. RENEWALS & RESERVATIONS: Renewal allowed ONCE if no reservation exists. Reservations can be placed online in Koha OPAC (catalog.nfsu.ac.in).
5. CONDUCT: Bags at property counter outside gate; only notebooks and laptops (without cases) inside. Strict silence; phones on silent mode. No food/drinks (except water). No seat reservations.
6. NO DUES: Clear all books, fines, and surrender cards signed by Deputy Librarian. Contact: library_gnr@nfsu.ac.in.

CONSTRAINTS:
1. Do NOT invent bibliographic records or fake metadata.
2. Do NOT claim books are physically in NFSU.
3. Answer all library rule questions (hours, fines, quotas, renewals) accurately based on the verified rules above.
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
