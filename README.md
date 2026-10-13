# NFSU KnowledgeGate — AI Research Assistant & Library Catalogue

[![Built for NFSU Library Hackathon](https://img.shields.io/badge/NFSU-Library%20Hackathon-0b1f3a?style=for-the-badge&logo=googlegemini)](https://catalog.nfsu.ac.in)
[![Vercel Compatible](https://img.shields.io/badge/Vercel-Serverless%20Ready-000000?style=for-the-badge&logo=vercel)](https://vercel.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)

**NFSU KnowledgeGate** is an AI-powered Personalised Research Assistant designed for students, researchers, and faculty at the **National Forensic Sciences University (NFSU)**, Gandhinagar. It bridges public bibliographic records from the Open Library Search API with university-specific e-resources, verified institutional policies, and an academic research suite.

---

## 🏛️ Key Features

### 1. Modern NFSU Academic Interface
- **University Library Landing Page**: Custom NFSU-inspired branding (Deep Academic Navy, Gold/Amber accents) with instant access to the library catalogue, e-journals, and research guides.
- **Multilingual Support**: Real-time interface and AI prompt translations for **English**, **हिन्दी (Hindi)**, and **ગુજરાતી (Gujarati)**.
- **Light & Dark Modes**: Accessible design tokens with smooth glassmorphism and WCAG-compliant contrast.
- **Voice Input**: Web Speech API integration for speech-to-text library questions.

### 2. Google Gemini AI Reasoning & Conversational Search Context
- **Query Understanding**: Classifies user intentions into catalogue searches, verified FAQ lookups, citation formatting, Boolean query building, or general research guidance.
- **Structured Filter Extraction**: Converts natural-language queries into Zod-validated JSON search filters (`query`, `title`, `author`, `subject`, `yearFrom`).
- **Conversational Memory**: Retains short-lived search context across turns (e.g. *"Find books on digital forensics"* ➡️ *"Show only recent books"* ➡️ *"Books by this author"* ➡️ *"Are these books available at NFSU?"*).
- **Strict Anti-Hallucination Boundaries**: Gemini is strictly prohibited from inventing bibliographic metadata, physical holdings, or institutional loan rules.
- **Graceful Quota Handling**: Automatically falls back to the built-in **NFSU Local Verified Reasoning Engine** when API keys are omitted or quotas are exceeded.

### 3. Real Book Search with Open Library Integration
- **Live Search**: Direct integration with `https://openlibrary.org/search.json` using explicit field projection (`key,title,author_name,first_publish_year,publish_year,isbn,publisher,cover_i,subject,edition_count`).
- **Year Attribution Integrity**: Clearly labels Open Library's `first_publish_year` as the earliest known publication of a work rather than silently treating it as a modern edition year.
- **Physical Availability Transparency**: For Open Library books, physical availability is labeled as *Unknown (NFSU Koha Not Connected)* with direct clickable deep links to search the official NFSU Koha OPAC.

### 4. Modular Catalogue Provider Interface
Easily switch between providers using the standard interface (`ICatalogueProvider`):
```typescript
interface ICatalogueProvider {
  searchBooks(filters: BookSearchFilters): Promise<CatalogueSearchResult>;
  getBookDetails(id: string): Promise<BookRecord | null>;
  getAvailability(id: string): Promise<AvailabilityResult>;
  getRecordUrl(id: string): string;
}
```
1. **`OpenLibraryProvider`**: Real-time queries to Open Library with thumbnail resolution.
2. **`DemoCatalogueProvider`**: Curated, verified offline stack containing seminal forensic science, cyber law, and digital forensics textbooks.
3. **`KohaProvider`**: Modular, future-ready Koha ILS REST API client (`/api/v1/biblios`). Keeps credentials isolated until authorized university API access is granted.

### 5. Curated Verified FAQ Knowledge Base
Structured knowledge base based on official sources:
- **[catalog.nfsu.ac.in](https://catalog.nfsu.ac.in)**: Koha OPAC navigation, E-Journal subscriptions (IEEE, ScienceDirect, Springer Nature, Wiley), specialized collections (*Hindi Sangrah*, *Sardar Smriti*, *Namo Manthan*), and KIBO accessibility devices.
- **[onos.gov.in](https://onos.gov.in/how-to-access)**: One Nation One Subscription campus static IP network access and off-campus INFED IDP access.
- **[idp.nfsu.edu.in](https://idp.nfsu.edu.in)**: Shibboleth-based single sign-on federation for off-campus library access.
- **[nfsu.refread.com](https://nfsu.refread.com)**: Remote portal for Law e-resources.
- **Verification Badging**: Institutional policies regarding library timings, loan limits, and overdue fines are explicitly tagged with `⚠️ Verification Required (Institutional Policy)` and linked to the library circulation desk.

### 6. Academic Research Suite
- **Interactive Citation Generator**: Instant reference and in-text citation formatting in **IEEE** (standard for forensic computing), **APA 7th** (forensic psychology/criminology), and **MLA 9th** (humanities/law) with BibTeX exports.
- **Boolean Query Builder**: Generates command-ready queries with field tags for IEEE Xplore, Scopus, and Web of Science.
- **Literature Review Roadmap**: 5-stage PRISMA-aligned systematic review framework.
- **E-Resource Directory**: Direct authenticated links to IEEE Xplore, ScienceDirect, Manupatra, LiveLaw, Turnitin, and BioRender.

### 7. Standalone Embeddable Koha Widget Build
- Compile a self-contained JavaScript bundle (`dist-widget/nfsu-library-widget.js`) via `npm run build:widget`.
- Embed into the live Koha OPAC with zero modifications to Koha Perl core files via the `opacuserjs` system preference.

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v18+` or `v20+` (tested on Node v25)
- npm `v9+` or `v11+`

### Local Development
1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/your-username/librarychatbot.git
   cd librarychatbot
   npm install
   ```

2. Configure environment variables (optional for local dev):
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API key (optional — app includes a fully functioning Local Reasoner):
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-1.5-flash
   CATALOGUE_PROVIDER=openlibrary
   KOHA_OPAC_URL=https://catalog.nfsu.ac.in
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. Run the automated test suite:
   ```bash
   npm test
   ```

5. Build for production:
   ```bash
   npm run build
   npm run build:widget
   ```

---

## ☁️ Vercel Deployment Guide

This project is built to deploy seamlessly to Vercel without requiring a dedicated Express or PostgreSQL server.

### Method 1: Deploy with Vercel CLI
```bash
npm install -g vercel
vercel login
vercel
```

### Method 2: Deploy via GitHub & Vercel Dashboard
1. Push your repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com/new), import your repository.
3. Configure Environment Variables in the Vercel Project Settings:
   - `GEMINI_API_KEY`: Your Google AI Studio API key
   - `GEMINI_MODEL`: `gemini-1.5-flash` (or `gemini-2.0-flash`)
   - `CATALOGUE_PROVIDER`: `openlibrary`
   - `KOHA_OPAC_URL`: `https://catalog.nfsu.ac.in`
4. Deploy! Vercel will automatically compile the frontend SPA and wire up the `/api/*` serverless functions.

---

## 🔒 Security & Reliability

- **Server-Side API Key Isolation**: Gemini credentials are kept in serverless functions and never exposed to client-side code.
- **Sliding-Window Rate Limiter**: Protects against quota exhaustion and malicious request flooding (default: 30 requests/minute per client).
- **Prompt Injection Defense**: Sanitizes input strings against escape sequences, developer mode overrides, and script tags.
- **Untrusted Catalogue Sanitization**: Escapes Open Library titles and publisher descriptions before rendering.
- **CORS & CSP Compliance**: Explicit header whitelisting for Koha OPAC domains and academic federations.
- **Stateless Privacy**: Zero persistent storage of personal conversation transcripts.

---

## 🧪 Automated Test Verification

The test suite validates catalogue providers, local reasoning engine, conversational context, and security:
- `✔ 1. OpenLibraryProvider enforces physical holding unknown and provides Koha link`
- `✔ 2. DemoCatalogueProvider correctly filters by topic, author and year`
- `✔ 3. KohaProvider keeps credentials isolated and reports correct status`
- `✔ 4. LocalReasoningEngine handles multi-turn conversational context`
- `✔ 5. Verified FAQs adhere to institutional verification requirements`
- `✔ 6. SecuritySanitizer strips prompt injections and safe URLs`
- `✔ 7. AcademicResearchAssistant formats citations in IEEE, APA, and MLA`

---

## 📜 License & Acknowledgements
- Developed for the **National Forensic Sciences University (NFSU)** Library Hackathon.
- Bibliographic records provided by the **Open Library Search API** (Internet Archive).
- Institutional resources referenced from **INFLIBNET Centre**, **ONOS Portal**, and **NFSU Central Library**.
