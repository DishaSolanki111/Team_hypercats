import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import { BookSearchFilters, ChatFilterExtraction, ChatIntent, ChatMessage, Language } from '../../types';
import { localReasoningEngine } from './localReasoningEngine';
import { SecuritySanitizer } from '../security/sanitizer';

// Zod Schema to strictly validate structured filter extraction from Gemini
export const FilterExtractionSchema = z.object({
  intent: z.enum([
    'catalogue_search',
    'faq_query',
    'academic_guidance',
    'koha_status',
    'citation_help',
    'boolean_builder',
    'general_help'
  ]),
  confidence: z.number().min(0).max(1).default(0.9),
  explanation: z.string(),
  searchFilters: z.object({
    query: z.string().optional(),
    title: z.string().optional(),
    author: z.string().optional(),
    subject: z.string().optional(),
    isbn: z.string().optional(),
    year: z.number().optional(),
    yearFrom: z.number().optional(),
    yearTo: z.number().optional()
  }).optional(),
  suggestedFollowUps: z.array(z.string()).default([]),
  relatedKeywords: z.array(z.string()).default([])
});

export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private modelName: string;
  private apiKey: string | null = null;

  constructor(apiKey?: string, modelName: string = 'gemini-1.5-flash') {
    this.modelName = modelName;
    const env: any = (typeof process !== 'undefined' && process.env) 
      ? process.env 
      : (typeof import.meta !== 'undefined' && (import.meta as any).env) 
        ? (import.meta as any).env 
        : {};
    const key = apiKey || env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY;
    if (key && typeof key === 'string' && key.trim() !== '' && key !== 'your_gemini_api_key_here') {
      this.apiKey = key;
      this.genAI = new GoogleGenerativeAI(key);
    }
  }

  setApiKey(key: string, model: string = 'gemini-1.5-flash'): void {
    if (key && key.trim()) {
      this.apiKey = key.trim();
      this.modelName = model;
      this.genAI = new GoogleGenerativeAI(this.apiKey);
    } else {
      this.apiKey = null;
      this.genAI = null;
    }
  }

  hasActiveKey(): boolean {
    return !!this.apiKey && !!this.genAI;
  }

  async processMessage(
    userMessage: string,
    history: ChatMessage[] = [],
    language: Language = 'en'
  ): Promise<{
    extraction: ChatFilterExtraction;
    assistantResponse: string;
    suggestedFollowUps: string[];
    relatedKeywords: string[];
    kohaCheckUrl?: string;
    isGeminiPowered: boolean;
  }> {
    const sanitizedInput = SecuritySanitizer.sanitizeQuery(userMessage);

    // If Gemini is not configured, seamlessly use verified local reasoning engine
    if (!this.hasActiveKey()) {
      const localResult = localReasoningEngine.processQuery(sanitizedInput, history, language);
      return {
        ...localResult,
        isGeminiPowered: false
      };
    }

    try {
      const model = this.genAI!.getGenerativeModel({
        model: this.modelName,
        generationConfig: {
          temperature: 0.2, // Lower temperature to prevent hallucination
          maxOutputTokens: 1024,
          responseMimeType: "application/json"
        }
      });

      const systemPrompt = `You are the AI Academic & Research Assistant for National Forensic Sciences University (NFSU) Library.
Your role is to understand user library queries, answer questions using official NFSU library rules, extract structured search filters into valid JSON, and provide concise academic guidance.

OFFICIAL NFSU LIBRARY RULES & TIMINGS (FROM catalog.nfsu.ac.in):
1. LIBRARY HOURS & TIMINGS:
   - General Library Reading Hours: 9:30 AM to 8:00 PM on all working days.
   - Book Circulation (Issue / Return / Renewal): 10:00 AM to 6:00 PM.
   - Digital Library Access: 24×7 access via campus network and INFED IDP (idp.nfsu.edu.in).
   - Exam Periods: Extended hours if permitted by university competent authorities.
2. BORROWING LIMITS & QUOTAS:
   - Faculty Members: Up to 10 Books
   - PhD Scholars: Up to 6 Books
   - Postgraduate (PG) Students (M.Tech/M.Sc/MBA): Up to 4 Books
   - Undergraduate (UG) Students (B.Tech/B.Sc/BBA): Up to 3 Books
3. OVERDUE FINES & LOST BOOKS POLICY:
   - Overdue fine accrues daily for delayed returns past the due date.
   - Lost Book Rule: The borrower MUST either replace the book with a new physical copy of the same/latest edition, OR pay the current market price plus a Rs. 100/- processing fee. Borrowers must not argue with library staff regarding cash settlements without following this protocol. Damaging/defacing books leads to disciplinary action.
4. RENEWALS & RESERVATIONS:
   - Book renewal is allowed ONCE, provided there is no pending reservation by another user.
   - Reservations can be placed online through the Koha OPAC (catalog.nfsu.ac.in).
5. CODE OF CONDUCT & BAGS:
   - Bags and large folders must be left at the property counter outside the gate. Only notebooks, loose papers, and laptops with chargers (without cases) are allowed inside.
   - Mobile phones must be on silent mode; phone calls strictly prohibited. Complete silence must be maintained.
   - Eating and drinks (except water) are strictly prohibited. No seat reservations in reading halls.
6. NO DUES CERTIFICATE & CONTACT:
   - Must return all books, clear fines, and surrender cards; signed by the Deputy Librarian.
   - Official Email: library_gnr@nfsu.ac.in.

STRICT CONSTRAINTS & BOUNDARIES:
1. NEVER INVENT bibliographic records, author names, ISBNs, publishers, publication dates, or book editions. Catalogue records are retrieved exclusively from Open Library / NFSU ILS.
2. NEVER CLAIM books are physically available in NFSU library stacks. Physical holding status at NFSU is managed exclusively in the official KOHA OPAC (catalog.nfsu.ac.in).
3. Answer all library rule questions (hours, fines, quotas, renewals) accurately based on the verified rules above.
4. Support English, Hindi, and Gujarati depending on user preference (Language: ${language}).
5. You must output a JSON object adhering exactly to this schema:
{
  "intent": "catalogue_search" | "faq_query" | "academic_guidance" | "koha_status" | "citation_help" | "boolean_builder" | "general_help",
  "confidence": 0.95,
  "explanation": "Concise natural language answer/explanation in ${language}",
  "searchFilters": {
    "query": "string (main keyword or subject)",
    "title": "string (if specific title requested)",
    "author": "string (if author filter requested)",
    "subject": "string",
    "yearFrom": 2020 (if recent or after year requested),
    "year": 2021 (if specific year requested)
  },
  "suggestedFollowUps": ["Follow up question 1", "Follow up question 2"],
  "relatedKeywords": ["Forensic science term 1", "Term 2"]
}`;

      // Build context history summary
      const contextSummary = history.slice(-4).map(h => `${h.role}: ${h.content}`).join('\n');
      const prompt = `${systemPrompt}\n\nRecent Conversation:\n${contextSummary}\n\nUser Message: "${sanitizedInput}"\n\nGenerate strictly valid JSON:`;

      // Call Gemini with 15s timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      });
      clearTimeout(timeoutId);

      const text = result.response.text();
      let parsedJson: any;
      try {
        parsedJson = JSON.parse(text);
      } catch {
        // Attempt to extract JSON substring
        const match = text.match(/\{[\s\S]*\}/);
        if (match) parsedJson = JSON.parse(match[0]);
        else throw new Error("Invalid JSON response from Gemini");
      }

      const validated = FilterExtractionSchema.parse(parsedJson);

      const extraction: ChatFilterExtraction = {
        intent: validated.intent as ChatIntent,
        confidence: validated.confidence,
        searchFilters: validated.searchFilters,
        extractedTopic: validated.searchFilters?.query || validated.searchFilters?.subject,
        extractedAuthor: validated.searchFilters?.author,
        extractedYear: validated.searchFilters?.year || validated.searchFilters?.yearFrom,
        suggestedFollowUps: validated.suggestedFollowUps,
        suggestedKeywords: validated.relatedKeywords
      };

      // Check if koha search url should be linked
      let kohaCheckUrl: string | undefined = undefined;
      if (validated.intent === 'koha_status' || validated.searchFilters?.query) {
        const q = validated.searchFilters?.query || validated.searchFilters?.title || 'forensics';
        kohaCheckUrl = `https://catalog.nfsu.ac.in/cgi-bin/koha/opac-search.pl?q=${encodeURIComponent(q)}`;
      }

      return {
        extraction,
        assistantResponse: validated.explanation,
        suggestedFollowUps: validated.suggestedFollowUps,
        relatedKeywords: validated.relatedKeywords,
        kohaCheckUrl,
        isGeminiPowered: true
      };
    } catch (err) {
      console.warn('Gemini API call failed or quota reached. Reverting to local reasoning engine:', err);
      const localResult = localReasoningEngine.processQuery(sanitizedInput, history, language);
      return {
        ...localResult,
        isGeminiPowered: false
      };
    }
  }
}

export const geminiService = new GeminiService();
