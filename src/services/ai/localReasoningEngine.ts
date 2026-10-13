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

    // 2. Specialized Library Rule Handlers (Official NFSU Koha OPAC catalog.nfsu.ac.in rules)
    
    // Rule A: Library Opening & Closing Timings
    const isTimingsQuery = 
      (lower.includes('open') && (lower.includes('close') || lower.includes('when') || lower.includes('time') || lower.includes('hours'))) ||
      lower.includes('timings') ||
      lower.includes('timing') ||
      lower.includes('library hours') ||
      lower.includes('circulation hours') ||
      lower.includes('working days') ||
      lower.includes('schedule') ||
      lower.includes('समय') ||
      lower.includes('कब खुलेगी') ||
      lower.includes('ખુલવા') ||
      lower.includes('સમય');

    if (isTimingsQuery) {
      return this.handleTimingsQuery(language);
    }

    // Rule B: Fines, Late Fees, and Lost Books Policy
    const isFineQuery = 
      lower.includes('fine') ||
      lower.includes('fines') ||
      lower.includes('late fee') ||
      lower.includes('overdue') ||
      lower.includes('penalty') ||
      lower.includes('lost book') ||
      lower.includes('lost a book') ||
      lower.includes('damage book') ||
      lower.includes('defacing') ||
      lower.includes('processing fee') ||
      lower.includes('जुर्माना') ||
      lower.includes('विलंब शुल्क') ||
      lower.includes('દંડ') ||
      lower.includes('ખોવાયેલ');

    if (isFineQuery) {
      return this.handleFinesQuery(language);
    }

    // Rule C: Borrowing Quotas & Limits (UG, PG, PhD, Faculty)
    const isQuotaQuery = 
      lower.includes('how many books') ||
      lower.includes('borrowing limit') ||
      lower.includes('book limit') ||
      lower.includes('book quota') ||
      lower.includes('issue limit') ||
      lower.includes('books can i issue') ||
      lower.includes('books can i borrow') ||
      lower.includes('phd books') ||
      lower.includes('faculty books') ||
      lower.includes('ug books') ||
      lower.includes('pg books') ||
      lower.includes('कितनी पुस्तकें') ||
      lower.includes('કેટલા પુસ્તકો');

    if (isQuotaQuery) {
      return this.handleQuotaQuery(language);
    }

    // Rule D: Renewals & Reservations
    const isRenewalQuery = 
      lower.includes('renew') ||
      lower.includes('renewal') ||
      lower.includes('reservation') ||
      lower.includes('place a hold') ||
      lower.includes('नवीनीकरण') ||
      lower.includes('રિન્યુ');

    if (isRenewalQuery) {
      return this.handleRenewalQuery(language);
    }

    // Rule E: No Dues Clearance Certificate
    const isNoDuesQuery = 
      lower.includes('no dues') ||
      lower.includes('clearance certificate') ||
      lower.includes('leaving university') ||
      lower.includes('अदेयता') ||
      lower.includes('નો ડ્યૂઝ');

    if (isNoDuesQuery) {
      return this.handleNoDuesQuery(language);
    }

    // Rule F: Turnitin Plagiarism Access
    const isTurnitinQuery = 
      lower.includes('turnitin') ||
      lower.includes('plagiarism') ||
      lower.includes('similarity report') ||
      lower.includes('साहित्यिक चोरी');

    if (isTurnitinQuery) {
      return this.handleTurnitinQuery(language);
    }

    // 3. Physical NFSU Availability Query
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

    // 4. Conversational Follow-up Filters
    // Follow-up date filter (e.g. "Show only recent books")
    const isRecentFilter = 
      lower.includes('recent') ||
      lower.includes('latest') ||
      lower.includes('new books') ||
      lower.includes('हाल ही') ||
      lower.includes('નવા પુસ્તકો');

    if (isRecentFilter && context.lastTopic) {
      return this.handleRecentBooksFollowUp(context, language);
    }

    // Follow-up author filter (e.g. "Find books by this author")
    const isAuthorFollowUp = 
      (lower.includes('by this author') || lower.includes('same author') || lower.includes('लेखक की') || lower.includes('આ લેખક')) &&
      context.lastAuthor;

    if (isAuthorFollowUp) {
      return this.handleAuthorFollowUp(context, language);
    }

    // 5. Academic Assistant (Citations & Boolean Queries)
    if (lower.includes('cite') || lower.includes('citation') || lower.includes('ieee') || lower.includes('apa') || lower.includes('mla') || lower.includes('उद्धरण') || lower.includes('સાઇટેશન')) {
      return this.handleCitationRequest(text, context, language);
    }

    if (lower.includes('boolean') || lower.includes('search query') || lower.includes('and or not') || lower.includes('બુલિયન') || lower.includes('बूलियन')) {
      return this.handleBooleanQueryRequest(text, context, language);
    }

    // 6. Generic FAQ match
    const matchedFaq = this.matchFaq(lower);
    if (matchedFaq) {
      return this.handleFaqResponse(matchedFaq, language);
    }

    // 7. General Catalogue Search
    return this.handleGeneralCatalogueSearch(text, context, language);
  }

  // --- Official Rule Handlers from catalog.nfsu.ac.in ---

  private handleTimingsQuery(language: Language) {
    let response = "";
    if (language === 'hi') {
      response = `### 🕒 NFSU पुस्तकालय का आधिकारिक समय (Official Timings)\n\nआधिकारिक NFSU Koha पोर्टल (**catalog.nfsu.ac.in**) के अनुसार:\n\n• **सामान्य पुस्तकालय वाचनालय समय:** सुबह **9:30 AM से रात 8:00 PM** तक (सभी कार्य दिवसों में)।\n• **पुस्तक परिचालन काउंटर (इश्यू / रिटर्न / रिन्यू):** सुबह **10:00 AM से शाम 6:00 PM** तक।\n• **डिजिटल लाइब्रेरी एवं ई-संसाधन:** परिसर नेटवर्क एवं INFED IDP (idp.nfsu.edu.in) के माध्यम से **24×7** सुलभ।\n• **परीक्षा अवधि:** विश्वविद्यालय सक्षम अधिकारियों की अनुमति से परीक्षा के दौरान समय बढ़ाया जा सकता है।\n• **अवकाश:** छुट्टियों के दिनों में पूर्व सूचना देकर समय कम किया जा सकता है।\n\n📌 *स्रोत: [NFSU Library Hours & Rules (catalog.nfsu.ac.in)](https://catalog.nfsu.ac.in/cgi-bin/koha/opac-page.pl?page_id=28)*`;
    } else if (language === 'gu') {
      response = `### 🕒 NFSU લાઇબ્રેરીનો સત્તાવાર સમય (Official Timings)\n\nસત્તાવાર NFSU Koha પોર્ટલ (**catalog.nfsu.ac.in**) મુજબ:\n\n• **લાઇબ્રેરી રીડિંગ હોલ સમય:** સવારે **9:30 AM થી રાત્રે 8:00 PM** સુધી (બધા કામકાજના દિવસોમાં).\n• **પુસ્તક ઇશ્યૂ / રિટર્ન / રિન્યુઅલ:** સવારે **10:00 AM થી સાંજે 6:00 PM** સુધી.\n• **ડિજિટલ લાઇબ્રેરી:** કેમ્પસ નેટવર્ક અને INFED IDP (idp.nfsu.edu.in) દ્વારા **24×7** ઉપલબ્ધ.\n• **પરીક્ષા સમય:** સક્ષમ અધિકારીઓની મંજૂરીથી પરીક્ષા દરમિયાન સમય લંબાવી શકાય છે.\n\n📌 *સ્ત્રોત: [NFSU Library Hours & Rules (catalog.nfsu.ac.in)](https://catalog.nfsu.ac.in/cgi-bin/koha/opac-page.pl?page_id=28)*`;
    } else {
      response = `### 🕒 NFSU Central Library Timings (Verified Official Schedule)\n\nAccording to the official **NFSU KOHA OPAC (catalog.nfsu.ac.in)** standing rules:\n\n• **General Library Hours**: **9:30 AM to 8:00 PM** on all working days.\n• **Circulation Services (Issue / Return / Renewal)**: **10:00 AM to 6:00 PM**.\n• **Digital Library & E-Resources**: Accessible **24×7** through the campus-wide network and remote INFED IDP (\`idp.nfsu.edu.in\`).\n• **Examination Periods**: Library hours may be extended during examinations or curtailed on holidays with prior notice, subject to approval by the Competent Authorities of the University.\n\n📌 *Official Source: [NFSU Library Rules (catalog.nfsu.ac.in)](https://catalog.nfsu.ac.in/cgi-bin/koha/opac-page.pl?page_id=28)*`;
    }

    return {
      extraction: {
        intent: 'faq_query' as ChatIntent,
        confidence: 0.99
      },
      assistantResponse: response,
      suggestedFollowUps: [
        "What is the fine for overdue books?",
        "How many books can a student borrow?",
        "Can I renew issued books online?"
      ],
      relatedKeywords: ["9:30 AM to 8:00 PM", "Circulation: 10 AM - 6 PM", "Working Days", "24x7 Digital Access"],
      kohaCheckUrl: "https://catalog.nfsu.ac.in/cgi-bin/koha/opac-page.pl?page_id=31"
    };
  }

  private handleFinesQuery(language: Language) {
    let response = "";
    if (language === 'hi') {
      response = `### 💰 NFSU पुस्तकालय में अतिदेय जुर्माना (Overdue Fine) और खोई हुई पुस्तक के नियम\n\nआधिकारिक NFSU Koha नियमों (**catalog.nfsu.ac.in**) के अनुसार:\n\n1. **अतिदेय जुर्माना (Overdue Fine):**\n   • पुस्तकें मुहर लगी नियत तिथि (Due Date) तक या उससे पहले लौटानी अनिवार्य हैं।\n   • नियत तिथि के बाद प्रतिदिन के आधार पर प्रति पुस्तक जुर्माना लगता है।\n\n2. **खोई हुई पुस्तक का निपटान (Lost Book Settlement - अनिवार्य नियम):**\n   • **विकल्प A:** खोई हुई पुस्तक के बदले उसी या नवीनतम संस्करण की **नई भौतिक प्रति** (New Copy) जमा करें।\n   • **विकल्प B:** पुस्तक का वर्तमान बाजार मूल्य (Market Price) + **100 रुपये प्रसंस्करण शुल्क (Rs. 100/- Processing Fee)** का भुगतान करें।\n   • ⚠️ *विशेष निर्देश:* कृपया अपने खाते का निपटान करने के लिए बिना नई पुस्तक/शुल्क के भुगतान को लेकर पुस्तकालय कर्मचारियों से बहस न करें।\n\n3. **क्षतिग्रस्त सामग्री:** पुस्तक को विकृत करने, पन्ने फाड़ने या निशान लगाने पर विश्वविद्यालय अधिकारियों को अनुशासनात्मक कार्रवाई हेतु सूचित किया जाएगा।\n\n📌 *स्रोत: [NFSU FAQs & Lost Book Policy](https://catalog.nfsu.ac.in/cgi-bin/koha/opac-page.pl?page_id=25)*`;
    } else if (language === 'gu') {
      response = `### 💰 NFSU લાઇબ્રેરી લેટ ફી (Fine) અને ખોવાયેલા પુસ્તકો અંગેના સત્તાવાર નિયમો\n\nસત્તાવાર **catalog.nfsu.ac.in** મુજબ:\n\n1. **ઓવરડ્યુ દંડ:** નિયત તારીખે પુસ્તક પરત ન કરવા બદલ દૈનિક લેટ ફી લેવામાં આવે છે.\n2. **ખોવાયેલ પુસ્તક (Lost Book Policy):**\n   • **વિકલ્પ A:** સમાન અથવા નવીનતમ આવૃત્તિની **નવી નકલ** જમા કરાવો.\n   • **વિકલ્પ B:** પુસ્તકની વર્તમાન બજાર કિંમત + **રૂ. 100 પ્રોસેસિંગ ફી** ચૂકવો.\n   • ⚠️ લાઇબ્રેરી સ્ટાફ સાથે વિવાદ કરવો નહીં; નવી નકલ આપવી અથવા નિયત ફી ભરવી ફરજિયાત છે.\n3. **પુસ્તક નુકસાન:** પુસ્તક પર નિશાન કરવા કે નુકસાન પહોંચાડવા પર શિસ્તભંગના પગલાં લેવાશે.\n\n📌 *સ્ત્રોત: [NFSU Koha FAQs (catalog.nfsu.ac.in)](https://catalog.nfsu.ac.in/cgi-bin/koha/opac-page.pl?page_id=25)*`;
    } else {
      response = `### 💰 NFSU Overdue Fines & Lost Book Settlement Policy\n\nAccording to the official **NFSU Library Rules (catalog.nfsu.ac.in)**:\n\n1. **Overdue Books & Fines**:\n   • Books must be returned to the library on or before the stamped due date.\n   • Overdue fines accrue on a daily basis per item for delayed returns.\n\n2. **Lost Book Settlement Policy (Strict Institutional Protocol)**:\n   • **Option A (Replacement)**: Replace the lost book with a **new physical copy** of the same or latest edition.\n   • **Option B (Payment)**: Pay the **current market price** of the book PLUS a non-refundable **Rs. 100/- processing fee**.\n   • ⚠️ *Official Notice*: *\"Please do not insist on or argue with the Library staff about accepting payment to settle your account without following the prescribed replacement/fee protocol.\"*\n\n3. **Damaged / Defaced Materials**:\n   • Marking, highlighting, defacing, or damaging library materials is strictly prohibited and reported to University authorities for disciplinary action.\n\n📌 *Official Source: [NFSU Library FAQs & Rules (catalog.nfsu.ac.in)](https://catalog.nfsu.ac.in/cgi-bin/koha/opac-page.pl?page_id=25)*`;
    }

    return {
      extraction: {
        intent: 'faq_query' as ChatIntent,
        confidence: 0.99
      },
      assistantResponse: response,
      suggestedFollowUps: [
        "What are the library opening and closing hours?",
        "How many books can I issue at once?",
        "Can I renew a book online to avoid fines?"
      ],
      relatedKeywords: ["Overdue Fine", "Lost Book: New Copy or Market Price + Rs 100", "Defacing Penalty", "Due Date"],
      kohaCheckUrl: "https://catalog.nfsu.ac.in/cgi-bin/koha/opac-page.pl?page_id=28"
    };
  }

  private handleQuotaQuery(language: Language) {
    let response = "";
    if (language === 'hi') {
      response = `### 📚 NFSU पुस्तकालय पुस्तक ऋण कोटा (Borrowing Limits)\n\nआधिकारिक NFSU Koha नियमों (**catalog.nfsu.ac.in**) के अनुसार:\n\n• **संकाय सदस्य (Faculty Members):** अधिकतम **10 पुस्तकें**\n• **पीएचडी शोधार्थी (PhD Scholars):** अधिकतम **6 पुस्तकें**\n• **स्नातकोत्तर (PG) छात्र (M.Tech, M.Sc, MBA):** अधिकतम **4 पुस्तकें**\n• **स्नातक (UG) छात्र (B.Tech, B.Sc, BBA):** अधिकतम **3 पुस्तकें**\n\n📌 *नियम:* अपने पुस्तकालय कार्ड सुरक्षित रखें और किसी अन्य छात्र को न दें। कार्ड पर जारी पुस्तकों के लिए कार्डधारक स्वयं जिम्मेदार होता है।\n\n📌 *स्रोत: [NFSU FAQs (catalog.nfsu.ac.in)](https://catalog.nfsu.ac.in/cgi-bin/koha/opac-page.pl?page_id=25)*`;
    } else if (language === 'gu') {
      response = `### 📚 NFSU પુસ્તક ઇશ્યૂ મર્યાદા (Borrowing Limits)\n\nસત્તાવાર **catalog.nfsu.ac.in** મુજબ:\n\n• **ફેકલ્ટી સભ્યો:** **10 પુસ્તકો** સુધી\n• **પીએચડી સ્કોલર્સ:** **6 પુસ્તકો** સુધી\n• **પીજી (PG) વિદ્યાર્થીઓ (M.Tech/M.Sc):** **4 પુસ્તકો** સુધી\n• **યુજી (UG) વિદ્યાર્થીઓ (B.Tech/B.Sc):** **3 પુસ્તકો** સુધી\n\n📌 *સ્ત્રોત: [NFSU Koha FAQs](https://catalog.nfsu.ac.in/cgi-bin/koha/opac-page.pl?page_id=25)*`;
    } else {
      response = `### 📚 NFSU Official Borrowing Limits & Quotas\n\nAccording to the official **NFSU Koha Catalogue (catalog.nfsu.ac.in)** circulation rules:\n\n• **Faculty Members**: Up to **10 Books**\n• **PhD Research Scholars**: Up to **6 Books**\n• **Postgraduate (PG) Students (M.Tech / M.Sc / MBA)**: Up to **4 Books**\n• **Undergraduate (UG) Students (B.Tech / B.Sc / BBA)**: Up to **3 Books**\n\n📌 *Important Rules*:\n- Books must be returned on or before the due date to avoid overdue fines.\n- Borrowers are strictly responsible for books issued in their name. Do not share or lend library cards to fellow students.\n\n📌 *Official Source: [NFSU Koha Circulation Policy (catalog.nfsu.ac.in)](https://catalog.nfsu.ac.in/cgi-bin/koha/opac-page.pl?page_id=25)*`;
    }

    return {
      extraction: {
        intent: 'faq_query' as ChatIntent,
        confidence: 0.99
      },
      assistantResponse: response,
      suggestedFollowUps: [
        "What are the library timings?",
        "Can I renew my books online?",
        "What is the fine for late returns?"
      ],
      relatedKeywords: ["Faculty: 10 books", "PhD: 6 books", "PG: 4 books", "UG: 3 books", "Borrowing Privileges"],
      kohaCheckUrl: "https://catalog.nfsu.ac.in/cgi-bin/koha/opac-page.pl?page_id=25"
    };
  }

  private handleRenewalQuery(language: Language) {
    let response = "";
    if (language === 'hi') {
      response = `### 🔄 NFSU पुस्तक नवीनीकरण (Renewal) एवं आरक्षण (Hold/Reservation)\n\nआधिकारिक NFSU Koha नियमों (**catalog.nfsu.ac.in**) के अनुसार:\n\n• **नवीनीकरण (Renewal):** जारी पुस्तक का नवीनीकरण **केवल 1 बार (Once)** किया जा सकता है, बशर्ते किसी अन्य पाठक द्वारा उस पर आरक्षण (Reservation) न लगाया गया हो।\n• **आरक्षण (Reservation):** यदि कोई पुस्तक किसी अन्य पाठक के पास जारी है, तो आप कोहा ओपैक (**catalog.nfsu.ac.in**) में लॉगिन करके उस पर आरक्षण लगा सकते हैं।\n• **तात्कालिक वापसी:** यदि किसी शोधार्थी को पुस्तक की तत्काल आवश्यकता होती है, तो पुस्तकालय कर्मचारी मूल पाठक से समय से पहले वापसी के लिए संपर्क करेंगे।\n• **संदर्भ सामग्री (Reference Books):** संदर्भ प्रतियों और अधिक मांग वाली पुस्तकों की ऋण अवधि सीमित या प्रतिबंधित होती है।`;
    } else if (language === 'gu') {
      response = `### 🔄 NFSU પુસ્તક રિન્યુઅલ અને રિઝર્વેશન નિયમો\n\nસત્તાવાર **catalog.nfsu.ac.in** મુજબ:\n\n• **રિન્યુઅલ:** પુસ્તક **ફક્ત 1 વાર** રિન્યુ થઈ શકે છે, જો અન્ય કોઈનું રિઝર્વેશન ન હોય.\n• **રિઝર્વેશન:** કોહા ઓપૅક પર ઓનલાઇન રિઝર્વ કરી શકાય છે.\n• **ઇમરજન્સી રિકોલ:** તાકીદની જરૂરિયાતમાં સ્ટાફ મૂળ યુઝર પાસેથી વહેલા પુસ્તક મંગાવી શકે છે.`;
    } else {
      response = `### 🔄 NFSU Book Renewals & Online Reservations\n\nAccording to official **NFSU Koha Rules (catalog.nfsu.ac.in)**:\n\n• **Renewal Limit**: A book renewal is **allowed ONCE**, provided no pending reservation exists on the item from another user.\n• **Placing Reservations**: Users may place holds/reservations on currently issued items directly via the [NFSU KOHA OPAC](https://catalog.nfsu.ac.in).\n• **Urgent Recall**: If an issued item is needed urgently by another researcher, library staff will contact the borrower for expedited return.\n• **Reference Materials**: Reference stack items and high-demand course reserves carry shorter or restricted loan periods.\n\n📌 *Official Source: [NFSU General Library Rules (catalog.nfsu.ac.in)](https://catalog.nfsu.ac.in/cgi-bin/koha/opac-page.pl?page_id=28)*`;
    }

    return {
      extraction: {
        intent: 'faq_query' as ChatIntent,
        confidence: 0.98
      },
      assistantResponse: response,
      suggestedFollowUps: [
        "What are the circulation counter timings?",
        "What is the fine if a book is overdue?",
        "Search KOHA OPAC for books"
      ],
      relatedKeywords: ["Renewal Allowed Once", "Online Reservation via Koha", "Urgent Recall", "Reference Reserves"],
      kohaCheckUrl: "https://catalog.nfsu.ac.in"
    };
  }

  private handleNoDuesQuery(language: Language) {
    let response = "";
    if (language === 'hi') {
      response = `### 📜 अदेयता प्रमाणपत्र (No Dues Certificate) प्राप्त करने की प्रक्रिया\n\nआधिकारिक NFSU Koha नियमों (**catalog.nfsu.ac.in**) के अनुसार:\nविश्वविद्यालय छोड़ने या डिग्री पूर्ण होने से पहले छात्रों एवं कर्मचारियों को पुस्तकालय से 'No Dues Certificate' प्राप्त करना अनिवार्य है:\n\n1. सभी उधार ली गई पुस्तकें, पत्रिकाएँ और सामग्री पुस्तकालय में जमा करें।\n2. किसी भी लंबित अतिदेय जुर्माने या खोई हुई पुस्तक की देनदारी का निपटान करें।\n3. अपने पुस्तकालय कार्ड (Borrower Cards) कर्मचारियों को वापस जमा करें।\n4. अदेयता प्रमाणपत्र पर **उप-पुस्तकालयाध्यक्ष (Deputy Librarian)** द्वारा हस्ताक्षर किए जाएंगे।\n\n📧 सहायता के लिए संपर्क करें: \`library_gnr@nfsu.ac.in\``;
    } else if (language === 'gu') {
      response = `### 📜 No Dues પ્રમાણપત્ર પ્રક્રિયા (catalog.nfsu.ac.in)\n\nયુનિવર્સિટી છોડતા પહેલાં 'No Dues Certificate' લેવું ફરજિયાત છે:\n1. બધા ઉછીના પુસ્તકો પરત કરો.\n2. બાકી લેટ ફી કે દંડ ક્લિયર કરો.\n3. લાઇબ્રેરી કાર્ડ સ્ટાફને પરત જમા કરાવો.\n4. ડેપ્યુટી લાઇબ્રેરીયન (Deputy Librarian) સહી કરશે.\n\n📧 ઇમેઇલ: \`library_gnr@nfsu.ac.in\``;
    } else {
      response = `### 📜 Official 'No Dues Certificate' Clearance Procedure\n\nAccording to **NFSU Koha General Rules (catalog.nfsu.ac.in)**:\nBefore leaving the university or upon course completion, students and staff must obtain a **'No Dues Certificate'** from the Central Library:\n\n1. **Return Materials**: Deposit all borrowed books, journals, and equipment.\n2. **Settle Fines**: Clear any outstanding overdue fines or lost book obligations.\n3. **Surrender Cards**: Submit your physical library cards back to the library counter.\n4. **Authorisation**: The certificate must be officially signed by the **Deputy Librarian**.\n\n📧 *For clearance inquiries, contact:* \`library_gnr@nfsu.ac.in\``;
    }

    return {
      extraction: {
        intent: 'faq_query' as ChatIntent,
        confidence: 0.98
      },
      assistantResponse: response,
      suggestedFollowUps: [
        "What are the circulation timings to return books?",
        "What is the fine on overdue books?",
        "Email library help desk"
      ],
      relatedKeywords: ["No Dues Certificate", "Deputy Librarian Signature", "Surrender Library Cards", "Clear Overdue Fines"]
    };
  }

  private handleTurnitinQuery(language: Language) {
    let response = "";
    if (language === 'hi') {
      response = `### 🛡️ टर्निटिन (Turnitin) साहित्यिक चोरी जांच नीति\n\nआधिकारिक NFSU Koha पोर्टल (**catalog.nfsu.ac.in/cgi-bin/koha/opac-page.pl?page_id=25**) के अनुसार:\n\n• **संकाय सदस्य (Faculty Members):** सभी संकाय सदस्यों को टर्निटिन का पूर्ण प्रत्यक्ष एक्सेस दिया जाता है।\n• **शोधार्थी एवं छात्र (Students & Scholars):** अपने शोध निर्देशक (Supervisor / Instructor) के माध्यम से टर्निटिन का उपयोग कर सकते हैं।\n• **वर्कफ़्लो:** शिक्षक क्लास और असाइनमेंट वर्कफ़्लो के माध्यम से शोधपत्रों और थीसिस की समानता रिपोर्ट (Similarity Report) की जांच करते हैं।\n• **प्रशिक्षण:** टर्निटिन के सहयोग से आवधिक उपयोगकर्ता प्रशिक्षण सत्र आयोजित किए जाते हैं।`;
    } else if (language === 'gu') {
      response = `### 🛡️ Turnitin પ્લેજિઆરિઝમ નીતિ\n\nસત્તાવાર **catalog.nfsu.ac.in** મુજબ:\n• **ફેકલ્ટી:** સીધું ટર્નિટિન એક્સેસ.\n• **વિદ્યાર્થીઓ:** પોતાના સંશોધન માર્ગદર્શક / ગાઈડ દ્વારા થીસીસ અને પેપર ચકાસી શકે છે.`;
    } else {
      response = `### 🛡️ Official Turnitin Similarity Checking Policy\n\nAccording to **NFSU FAQs (catalog.nfsu.ac.in)**:\n\n• **Faculty Members**: All faculty members are eligible for direct, full-fledged instructor access to Turnitin.\n• **Research Scholars & Students**: Access Turnitin through their research supervisor / designated instructor.\n• **Workflow**: Instructors use the Class and Assignment Workflow to evaluate similarity reports for theses and dissertations.\n• **Training**: Periodic training sessions are conducted in collaboration with Turnitin for faculty and researchers.`;
    }

    return {
      extraction: {
        intent: 'faq_query' as ChatIntent,
        confidence: 0.98
      },
      assistantResponse: response,
      suggestedFollowUps: [
        "How do I access ONOS research journals?",
        "Format citation in IEEE style",
        "Generate Boolean search string"
      ],
      relatedKeywords: ["Turnitin Access", "Class and Assignment Workflow", "Instructor Access", "Similarity Index"]
    };
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
      text = `एनएफएसयू पुस्तकालय की वास्तविक भौतिक प्रतियों (हार्डकॉपी) की उपलब्धता सीधे हमारे आधिकारिक KOHA कैटलॉग में देखी जाती है।\n\nसार्वजनिक ओपन लाइब्रेरी रिकॉर्ड्स से भौतिक शेल्फ स्थिति सीधे लिंक नहीं है। आप आधिकारिक NFSU KOHA OPAC पर तुरंत खोज सकते हैं:\n🔗 [NFSU KOHA कैटलॉग खोजें](${kohaUrl})\n\nयदि पुस्तक केंद्रीय पुस्तकालय या परिसर पुस्तकालय में उपलब्ध है, तो आपको रैक स्थान, परिग्रहण संख्या (Accession No.) और जारी करने की स्थिति दिखाई देगी।\n\n📌 *पुस्तकालय का समय: सुबह 9:30 AM से रात 8:00 PM (पुस्तक जारी काउंटर: 10:00 AM से 6:00 PM)*`;
    } else if (language === 'gu') {
      text = `NFSU લાઇબ્રેરીમાં પુસ્તકોની ભૌતિક ઉપલબ્ધતા (હાર્ડકોપી) સત્તાવાર KOHA OPAC પર ઉપલબ્ધ છે.\n\nઓપન લાઇબ્રેરી રેકોર્ડ્સ ભૌતિક પુસ્તકાલય ઉપલબ્ધતા સાથે સીધા જોડાયેલ નથી. તમે સત્તાવાર કેટલોગ પર ચકાસી શકો છો:\n🔗 [NFSU KOHA કેટલોગ ખોલો](${kohaUrl})\n\nત્યાં તમને રૅક નંબર, એક્સેસન નંબર અને ઇશ્યૂ સ્થિતિ જોવા મળશે.\n\n📌 *સમય: સવારે 9:30 થી રાત્રે 8:00 (ઇશ્યૂ કાઉન્ટર: 10 AM - 6 PM)*`;
    } else {
      text = `Live physical holdings (copies on shelves, issue status, and rack location) at NFSU Gandhinagar and regional campuses are managed in the official **NFSU KOHA OPAC**.\n\nOpen Library records provide global bibliographic metadata and do not reflect real-time physical availability in NFSU stacks. Please check the official catalogue directly:\n\n🔗 **[Search Physical Availability on NFSU KOHA OPAC](${kohaUrl})**\n\n• **Circulation Desk Hours**: **10:00 AM to 6:00 PM** (Library open 9:30 AM to 8:00 PM on all working days).\n• Visit the Central Library Circulation Counter with your institutional ID card to borrow.`;
    }

    return {
      extraction: {
        intent: 'koha_status' as ChatIntent,
        confidence: 0.98,
        searchFilters: context.lastFilters
      },
      assistantResponse: text,
      suggestedFollowUps: [
        "What are the library opening and closing hours?",
        "What is the fine if a book is overdue?",
        "How many books can a student borrow?"
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

    const response = `### ${questionText}\n\n${answerText}\n\n---\n✅ **Verified Official Source:** [${faq.sourceTitle}](${faq.sourceUrl})\n*Last verified: ${faq.lastCheckedDate}*`;

    return {
      extraction: {
        intent: 'faq_query' as ChatIntent,
        confidence: 0.95
      },
      assistantResponse: response,
      suggestedFollowUps: [
        "What are the library opening and closing hours?",
        "What are the borrowing limits for students?",
        "What is the fine for lost or overdue books?"
      ],
      relatedKeywords: faq.keywords
    };
  }

  private handleGeneralCatalogueSearch(text: string, context: ConversationalContext, language: Language) {
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
        "What are the library opening and closing hours?",
        "What are the borrowing limits?"
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
