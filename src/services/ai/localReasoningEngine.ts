import { BookSearchFilters, ChatFilterExtraction, ChatIntent, ChatMessage, Language } from '../../types';
import { verifiedFAQs } from '../../data/faqs';
import { academicAssistant } from '../academic/researchAssistant';

export interface ConversationalContext {
  lastTopic?: string;
  lastAuthor?: string;
  lastFilters?: BookSearchFilters;
  lastBookTitle?: string;
  historyLength: number;
}

export class LocalReasoningEngine {
  processQuery(
    userMessage: string,
    history: ChatMessage[],
    language: Language = 'en'
  ): {
    extraction: ChatFilterExtraction;
    assistantResponse: string;
    suggestedFollowUps: string[];
    relatedKeywords: string[];
    kohaCheckUrl?: string;
  } {
    const text = userMessage.trim();
    const lower = text.toLowerCase();

    // 1. Reconstruct short-lived conversational context
    const context = this.reconstructContext(history);

    // 2. Intent Identification
    // Is it asking about physical NFSU availability?
    const isAvailabilityQuery = 
      lower.includes('available at nfsu') ||
      lower.includes('available in nfsu') ||
      lower.includes('physical copy') ||
      lower.includes('in the library') ||
      lower.includes('shelf') ||
      lower.includes('can i borrow') ||
      lower.includes('उपलब्ध है') ||
      lower.includes('શું ઉપલબ્ધ છે');

    if (isAvailabilityQuery) {
      return this.handleAvailabilityQuery(context, language);
    }

    // Is it a follow-up date filter? (e.g., "Show only recent books")
    const isRecentFilter = 
      lower.includes('recent') ||
      lower.includes('latest') ||
      lower.includes('new books') ||
      lower.includes('हाल ही') ||
      lower.includes('નવા પુસ્તકો');

    if (isRecentFilter && context.lastTopic) {
      return this.handleRecentBooksFollowUp(context, language);
    }

    // Is it a follow-up author filter? (e.g., "Find books by this author")
    const isAuthorFollowUp = 
      (lower.includes('by this author') || lower.includes('same author') || lower.includes('लेखक की') || lower.includes('આ લેખક')) &&
      context.lastAuthor;

    if (isAuthorFollowUp) {
      return this.handleAuthorFollowUp(context, language);
    }

    // Is it citation assistance?
    if (lower.includes('cite') || lower.includes('citation') || lower.includes('ieee') || lower.includes('apa') || lower.includes('mla') || lower.includes('उद्धरण') || lower.includes('સાઇટેશન')) {
      return this.handleCitationRequest(text, context, language);
    }

    // Is it Boolean query generation?
    if (lower.includes('boolean') || lower.includes('search query') || lower.includes('and or not') || lower.includes('બુલિયન') || lower.includes('बूलियन')) {
      return this.handleBooleanQueryRequest(text, context, language);
    }

    // Is it a match for verified library FAQs?
    const matchedFaq = this.matchFaq(lower);
    if (matchedFaq) {
      return this.handleFaqResponse(matchedFaq, language);
    }

    // Is it a book search request?
    return this.handleGeneralCatalogueSearch(text, context, language);
  }

  private reconstructContext(history: ChatMessage[]): ConversationalContext {
    let lastTopic: string | undefined;
    let lastAuthor: string | undefined;
    let lastFilters: BookSearchFilters | undefined;
    let lastBookTitle: string | undefined;

    // Scan backwards from most recent message
    for (let i = history.length - 1; i >= 0; i--) {
      const msg = history[i];
      if (msg.extractedFilters) {
        if (!lastTopic && msg.extractedFilters.query) lastTopic = msg.extractedFilters.query;
        if (!lastFilters) lastFilters = msg.extractedFilters;
      }
      if (msg.books && msg.books.length > 0) {
        if (!lastBookTitle) lastBookTitle = msg.books[0].title;
        if (!lastAuthor && msg.books[0].authors.length > 0) {
          lastAuthor = msg.books[0].authors[0];
        }
      }
      if (lastTopic && lastAuthor && lastBookTitle) break;
    }

    return {
      lastTopic,
      lastAuthor,
      lastFilters,
      lastBookTitle,
      historyLength: history.length
    };
  }

  private handleAvailabilityQuery(context: ConversationalContext, language: Language) {
    const kohaUrl = `https://catalog.nfsu.ac.in/cgi-bin/koha/opac-search.pl?q=${encodeURIComponent(context.lastTopic || 'forensics')}`;
    
    let text = "";
    if (language === 'hi') {
      text = `एनएफएसयू पुस्तकालय की वास्तविक भौतिक प्रतियों (हार्डकॉपी) की उपलब्धता सीधे हमारे आधिकारिक KOHA कैटलॉग में देखी जाती है।\n\nसार्वजनिक ओपन लाइब्रेरी रिकॉर्ड्स से भौतिक शेल्फ स्थिति सीधे लिंक नहीं है। आप आधिकारिक NFSU KOHA OPAC पर तुरंत खोज सकते हैं:\n🔗 [NFSU KOHA कैटलॉग खोजें](${kohaUrl})\n\nयदि पुस्तक केंद्रीय पुस्तकालय या परिसर पुस्तकालय में उपलब्ध है, तो आपको रैक स्थान, परिग्रहण संख्या (Accession No.) और जारी करने की स्थिति दिखाई देगी।`;
    } else if (language === 'gu') {
      text = `NFSU લાઇબ્રેરીમાં પુસ્તકોની ભૌતિક ઉપલબ્ધતા (હાર્ડકોપી) સત્તાવાર KOHA OPAC પર ઉપલબ્ધ છે.\n\nઓપન લાઇબ્રેરી રેકોર્ડ્સ ભૌતિક પુસ્તકાલય ઉપલબ્ધતા સાથે સીધા જોડાયેલ નથી. તમે સત્તાવાર કેટલોગ પર ચકાસી શકો છો:\n🔗 [NFSU KOHA કેટલોગ ખોલો](${kohaUrl})\n\nત્યાં તમને રૅક નંબર, એક્સેસન નંબર અને ઇશ્યૂ સ્થિતિ જોવા મળશે.`;
    } else {
      text = `Live physical holdings (copies on shelves, issue status, and rack location) at NFSU Gandhinagar and regional campuses are managed in the official **NFSU KOHA OPAC**.\n\nOpen Library records provide global bibliographic metadata and do not reflect real-time physical availability in NFSU stacks. Please check the official catalogue directly:\n\n🔗 **[Search Physical Availability on NFSU KOHA OPAC](${kohaUrl})**\n\nIf you need the book issued or reserved, visit the Central Library Circulation Counter with your institutional ID card.`;
    }

    return {
      extraction: {
        intent: 'koha_status' as ChatIntent,
        confidence: 0.98,
        searchFilters: context.lastFilters
      },
      assistantResponse: text,
      suggestedFollowUps: [
        "Where is the Central Library located?",
        "How do I renew books online in Koha?",
        "Can I access digital e-books instead?"
      ],
      relatedKeywords: ["KOHA OPAC", "Accession Number", "Call Number", "Shelf Status"],
      kohaCheckUrl: kohaUrl
    };
  }

  private handleRecentBooksFollowUp(context: ConversationalContext, language: Language) {
    const topic = context.lastTopic || 'digital forensics';
    const recentYear = 2020;

    const filters: BookSearchFilters = {
      query: topic,
      yearFrom: recentYear
    };

    let text = "";
    if (language === 'hi') {
      text = `फ़िल्टर लागू किया गया: '${topic}' पर हाल ही में प्रकाशित पुस्तकें (वर्ष ${recentYear} के बाद)। ओपन लाइब्रेरी और कैटलॉग रिकॉर्ड नीचे दिए गए हैं।`;
    } else if (language === 'gu') {
      text = `'${topic}' પર તાજેતરના પુસ્તકો (વર્ષ ${recentYear} પછી) ફિલ્ટર કરવામાં આવ્યા છે. નીચે પુસ્તકોની સૂચિ છે.`;
    } else {
      text = `Filtered for recent publications: Displaying records for **"${topic}"** published from **${recentYear} onwards**. Notice: Open Library's earliest work year is distinguished from specific edition publication years.`;
    }

    return {
      extraction: {
        intent: 'catalogue_search' as ChatIntent,
        confidence: 0.95,
        searchFilters: filters,
        extractedTopic: topic,
        extractedYear: recentYear
      },
      assistantResponse: text,
      suggestedFollowUps: [
        "Find books by this author",
        "Generate a Boolean query for this topic",
        "Are these books available at NFSU?"
      ],
      relatedKeywords: [`${topic} recent research`, "Peer-reviewed literature", "Conference proceedings"]
    };
  }

  private handleAuthorFollowUp(context: ConversationalContext, language: Language) {
    const author = context.lastAuthor!;
    const filters: BookSearchFilters = {
      author
    };

    let text = "";
    if (language === 'hi') {
      text = `लेखक **"${author}"** द्वारा लिखित पुस्तकें खोजी जा रही हैं:`;
    } else if (language === 'gu') {
      text = `લેખક **"${author}"** દ્વારા લખાયેલ પુસ્તકો શોધી રહ્યા છીએ:`;
    } else {
      text = `Searching for bibliographic records by author: **${author}**. Retrieved matching works from the catalogue:`;
    }

    return {
      extraction: {
        intent: 'catalogue_search' as ChatIntent,
        confidence: 0.95,
        searchFilters: filters,
        extractedAuthor: author
      },
      assistantResponse: text,
      suggestedFollowUps: [
        "Show only recent books by this author",
        "Format citation for their main work",
        "Check availability on NFSU Koha"
      ],
      relatedKeywords: [author, `${author} publications`, "Co-authors"]
    };
  }

  private handleCitationRequest(query: string, context: ConversationalContext, language: Language) {
    let style: 'APA' | 'MLA' | 'IEEE' = 'IEEE';
    if (query.toLowerCase().includes('apa')) style = 'APA';
    else if (query.toLowerCase().includes('mla')) style = 'MLA';

    const title = context.lastBookTitle || "Cybercrime and Digital Forensics: An Introduction";
    const authors = context.lastAuthor ? [context.lastAuthor] : ["Thomas J. Holt", "Adam M. Bossler"];

    const citationResult = academicAssistant.generateCitation(title, authors, 2022, "Routledge", style);

    let explanation = "";
    if (language === 'hi') {
      explanation = `यहाँ ${style} शैली में उद्धरण प्रारूप है:\n\n**${citationResult.citation}**\n\n*इन-टेक्स्ट उद्धरण:* \`${citationResult.inTextCitation}\`\n\nआप इस उद्धरण को सीधे अपने शोधपत्र या थीसिस की संदर्भ सूची में कॉपी कर सकते हैं।`;
    } else if (language === 'gu') {
      explanation = `અહીં ${style} શૈલીમાં સંદર્ભ (સાઇટેશન) છે:\n\n**${citationResult.citation}**\n\n*ઇન-ટેક્સ્ટ સાઇટેશન:* \`${citationResult.inTextCitation}\`\n\nતમે તમારા સંશોધન પેપરમાં સીધું કૉપિ કરી શકો છો.`;
    } else {
      explanation = `Here is the formatted **${style}** citation for *"${title}"*:\n\n> **${citationResult.citation}**\n\n- **In-Text Citation**: \`${citationResult.inTextCitation}\`\n- **BibTeX Entry**:\n\`\`\`bibtex\n${citationResult.bibtex}\n\`\`\`\n\nTip: For technical forensic and computing papers submitted to IEEE conferences or journals, always use numerical bracketed citations \`[1]\`.`;
    }

    return {
      extraction: {
        intent: 'citation_help' as ChatIntent,
        confidence: 0.96,
        citationRequest: {
          topicOrTitle: title,
          style
        }
      },
      assistantResponse: explanation,
      suggestedFollowUps: [
        "Format in APA 7th style instead",
        "Format in MLA 9th style instead",
        "Generate Boolean search for literature review"
      ],
      relatedKeywords: ["IEEE Reference Guide", "APA 7th Manual", "Zotero / Mendeley export"]
    };
  }

  private handleBooleanQueryRequest(query: string, context: ConversationalContext, language: Language) {
    const topic = context.lastTopic || "Ransomware detection in critical infrastructure";
    const boolResult = academicAssistant.generateBooleanQuery(topic);

    let explanation = "";
    if (language === 'hi') {
      explanation = `**"${topic}"** के लिए उच्च-सटीक बूलियन खोज स्ट्रिंग:\n\n\`\`\`text\n${boolResult.queryString}\n\`\`\`\n\n**Scopus / Web of Science क्वेरी:**\n\`${boolResult.scopusQuery}\`\n\n**IEEE Xplore क्वेरी:**\n\`${boolResult.ieeQuery}\`\n\n${boolResult.explanation}`;
    } else if (language === 'gu') {
      explanation = `**"${topic}"** માટે બુલિયન સર્ચ ક્વેરી:\n\n\`\`\`text\n${boolResult.queryString}\n\`\`\`\n\n**IEEE Xplore ક્વેરી:**\n\`${boolResult.ieeQuery}\`\n\n${boolResult.explanation}`;
    } else {
      explanation = `Constructed an optimized Boolean research query for **"${topic}"**:\n\n\`\`\`text\n${boolResult.queryString}\n\`\`\`\n\n### Database-Specific Strings:\n- **IEEE Xplore Command Search**:\n  \`${boolResult.ieeQuery}\`\n- **Scopus / ScienceDirect Advanced**:\n  \`${boolResult.scopusQuery}\`\n\n**Strategy:**\n${boolResult.explanation}\n\nYou can paste these directly into ONOS-subscribed databases like IEEE Xplore, ScienceDirect, or SpringerLink.`;
    }

    return {
      extraction: {
        intent: 'boolean_builder' as ChatIntent,
        confidence: 0.94,
        extractedTopic: topic
      },
      assistantResponse: explanation,
      suggestedFollowUps: [
        "How do I search this in IEEE Xplore via ONOS?",
        "Plan a PRISMA literature review roadmap",
        "Find recent books on this topic"
      ],
      relatedKeywords: ["Boolean Operators", "Truncation (*)", "Wildcards (?)", "Field Tags"]
    };
  }

  private matchFaq(lower: string) {
    return verifiedFAQs.find(faq => {
      return faq.keywords.some(kw => lower.includes(kw));
    });
  }

  private handleFaqResponse(faq: typeof verifiedFAQs[0], language: Language) {
    const questionText = faq.question[language] || faq.question.en;
    const answerText = faq.answer[language] || faq.answer.en;

    const isVerified = faq.verificationStatus === 'verified';
    const badgeText = isVerified 
      ? `✅ **Verified Official Source:** [${faq.sourceTitle}](${faq.sourceUrl})`
      : `⚠️ **Verification Required:** Institutional policies are subject to library standing orders. Please verify directly at [${faq.sourceTitle}](${faq.sourceUrl}).`;

    const response = `### ${questionText}\n\n${answerText}\n\n---\n${badgeText}\n*Last verified: ${faq.lastCheckedDate}*`;

    return {
      extraction: {
        intent: 'faq_query' as ChatIntent,
        confidence: 0.95
      },
      assistantResponse: response,
      suggestedFollowUps: [
        "How do I search the physical library catalogue in Koha?",
        "What e-journals are available under ONOS?",
        "Find forensic science books"
      ],
      relatedKeywords: faq.keywords
    };
  }

  private handleGeneralCatalogueSearch(text: string, context: ConversationalContext, language: Language) {
    // Extract keywords and potential filters
    let query = text.replace(/find\s+(books|literature)\s+(about|on)?/i, '').replace(/search\s+for/i, '').trim();
    if (!query) query = 'forensic science';

    const filters: BookSearchFilters = {
      query
    };

    let assistantResponse = "";
    if (language === 'hi') {
      assistantResponse = `'**${query}**' के लिए ओपन लाइब्रेरी और ग्रंथसूची कैटलॉग में खोज की जा रही है। वास्तविक परिणाम नीचे प्रदर्शित हैं:`;
    } else if (language === 'gu') {
      assistantResponse = `'**${query}**' માટે ઓપન લાઇબ્રેરી અને કેટલોગમાં શોધ થઈ રહી છે. પરિણામો નીચે દર્શાવેલ છે:`;
    } else {
      assistantResponse = `Searching Open Library catalogue for **"${query}"**. Here are the verified bibliographic records. You can explore the editions or verify shelf availability on the official NFSU KOHA OPAC:`;
    }

    return {
      extraction: {
        intent: 'catalogue_search' as ChatIntent,
        confidence: 0.9,
        searchFilters: filters,
        extractedTopic: query
      },
      assistantResponse,
      suggestedFollowUps: [
        "Show only recent books",
        "Are these books available at NFSU?",
        "Generate a Boolean query for this topic",
        "How do I access research journals on this topic?"
      ],
      relatedKeywords: [
        `${query} methodologies`,
        `${query} case studies`,
        `${query} evidentiary standards`
      ]
    };
  }
}

export const localReasoningEngine = new LocalReasoningEngine();
