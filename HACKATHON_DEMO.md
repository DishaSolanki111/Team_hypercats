# NFSU KnowledgeGate — Hackathon Demonstration Walkthrough

This guide provides a structured, step-by-step demonstration walkthrough for the **NFSU Library Hackathon** judges and evaluators.

---

## 🎯 Target Persona & User Story
**Aayush Patel**, an M.Tech Cyber Security & Digital Forensics scholar at NFSU Gandhinagar, needs to:
1. Find peer-reviewed literature on *Memory Forensics* and *Incident Response*.
2. Verify if textbooks are physically in the Central Library stacks or require an online Koha OPAC search.
3. Access IEEE and Elsevier journals from off-campus via ONOS and INFED IDP.
4. Generate command-ready Boolean search queries and format citations in IEEE format.
5. Interact in their preferred language (English, हिन्दी, or ગુજરાતી).

---

## 🎬 7-Minute Live Demonstration Script

### Act 1: The University Landing Page & Catalogue Search (1 min)
1. **Showcase University Identity**:
   - Point out the official **NFSU Central Library** branding, Ministry of Home Affairs banner, and links to the official Koha catalogue (`catalog.nfsu.ac.in`).
2. **Execute Live Bibliographic Search**:
   - Click the **"Digital Forensics"** discipline pill or search for `"digital forensics"`.
   - Highlight the **Open Library Search API** integration.
   - Point out the **"First Published (Earliest Work)"** label with the tooltip explaining that Open Library returns earliest work dates rather than modern edition years.
3. **Physical Holding Transparency**:
   - Show that physical status is labeled as *Unknown (NFSU Koha Not Connected)*.
   - Click the golden **"Check Physical Copy on NFSU KOHA"** button to show that it generates a targeted query directly to `catalog.nfsu.ac.in`.

---

### Act 2: Multi-Turn Conversational Search in Floating Chatbot (2 mins)
1. **Open Assistant**:
   - Click the floating **"Research AI"** button at the bottom-right (or press `Ctrl + Space`).
2. **Turn 1 (Initial Search)**:
   - Type or click: `Find books about digital forensics`
   - **Observe**: The assistant parses user intent, extracts the search filters, and renders structured book cards inside the chat window.
3. **Turn 2 (Date Filter)**:
   - Type: `Show only recent books`
   - **Observe**: The AI retains the topic *"digital forensics"*, automatically adds `yearFrom: 2020`, and displays recent editions.
4. **Turn 3 (Author Resolution)**:
   - Type: `Find books by this author`
   - **Observe**: The conversational memory extracts the author from the previous result (e.g. *Thomas J. Holt*) and retrieves their bibliography.
5. **Turn 4 (Koha Availability Query)**:
   - Type: `Are these books available at NFSU?`
   - **Observe**: The AI explains that live physical shelf holdings are managed in the official Koha OPAC, explains the difference between public metadata and shelf availability, and presents a direct link to search the NFSU OPAC.

---

### Act 3: Multilingual Exploration (1 min)
1. In the chat header or the top navigation bar, change the language to **हिन्दी (HI)**:
   - Notice that the entire UI, badges, and AI responses switch to Hindi.
   - Ask: `परिसर के बाहर से ONOS ई-पत्रिकाओं तक कैसे पहुंचें?`
   - The assistant answers in Hindi with the verified INFLIBNET and INFED IDP procedure.
2. Change the language to **ગુજરાતી (GU)**:
   - Notice the authentic Gujarati translations tailored for the Gandhinagar campus community.
3. Switch back to **English (EN)**.

---

### Act 4: Verified FAQs & Policy Integrity (1 min)
1. Click the **"Verified FAQs"** tab in the main navigation.
2. Show the **"Verified Official Source"** badges for:
   - *ONOS Portal Access*: references `https://onos.gov.in/how-to-access`.
   - *Off-Campus INFED IDP*: references `https://idp.nfsu.edu.in`.
   - *RefRead Law Portal*: references `https://nfsu.refread.com`.
3. Filter by **"Verification Required (Policies)"**:
   - Click on *Library Timings, Borrowing Limits, and Overdue Fines*.
   - **Highlight the Judge-Winning Feature**: Explain that the AI assistant **does NOT invent** institutional borrowing limits or fine policies, but clearly marks them as requiring verification with the library circulation desk.

---

### Act 5: Academic Research Suite (1 min)
1. Click the **"Research Suite"** tab in the navigation:
   - **Citation Assistant**: Select **IEEE**, **APA 7th**, or **MLA 9th**. Click *"Copy Citation"* or copy the BibTeX block.
   - **Boolean Query Builder**: Type a topic like `Ransomware attack detection in smart grids`. Point out the auto-generated strings for **IEEE Xplore Command Search** and **Scopus/ScienceDirect Advanced**.
   - **Literature Review Roadmap**: View the 5-stage PRISMA-aligned protocol.
   - **E-Databases Directory**: Inspect direct access cards for IEEE Xplore, ScienceDirect, Manupatra, and Turnitin.

---

### Act 6: Koha Administrator Guide & Zero-Downtime Widget Build (1 min)
1. Click the **"KOHA Guide"** button in the top navigation:
   - Show the 6-line script snippet for Koha's `opacuserjs` system preference.
   - Review the Content Security Policy (CSP) headers and zero-downtime rollback steps.
2. Highlight that running `npm run build:widget` generated `dist-widget/nfsu-library-widget.js`, allowing the NFSU IT department to embed this chatbot into the actual Koha OPAC without altering any Perl code!

---

## 🏆 Key Architectural Highlights for Evaluators

| Criterion | Implementation in NFSU KnowledgeGate |
| :--- | :--- |
| **Real Data Integrity** | Queries live Open Library Search API with explicit field projection; never hallucinates bibliographic data. |
| **Koha Separation** | Clearly distinguishes public Open Library metadata from physical shelf holdings; provides direct OPAC deep links. |
| **Policy Verification** | Uses verified official sources (`catalog.nfsu.ac.in`, `onos.gov.in`, `idp.nfsu.edu.in`); unverified policies require circulation desk confirmation. |
| **Conversational Context** | 4-turn conversational state tracking (Topic ➡️ Year ➡️ Author ➡️ Holding status). |
| **Dual AI Execution** | Seamlessly runs with Google Gemini API or the built-in NFSU Local Reasoning Engine (zero setup required). |
| **Koha Integration** | Embeddable standalone widget bundle (`widget.js`) with complete administrative CSP and rollback documentation. |
| **Multilingual** | Full English, Hindi, and Gujarati coverage. |
| **Testing** | 100% automated test pass rate verifying providers, reasoner, sanitizer, and citations. |
