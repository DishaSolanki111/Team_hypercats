import { Language } from '../types';

export interface Translations {
  appName: string;
  appSubtitle: string;
  universityName: string;
  libraryName: string;
  searchPlaceholder: string;
  askAssistant: string;
  heroBadge: string;
  heroTitle: string;
  heroHighlight: string;
  heroDescription: string;
  quickSearch: string;
  exploreCatalog: string;
  openChat: string;
  closeChat: string;
  chatWelcomeTitle: string;
  chatWelcomeSubtitle: string;
  suggestedQuestions: string[];
  inputPlaceholder: string;
  send: string;
  searchingBooks: string;
  foundResults: string;
  noResults: string;
  viewOnOpenLibrary: string;
  checkKohaAvailability: string;
  kohaDisclaimer: string;
  openLibraryNotice: string;
  earliestPubYearLabel: string;
  editionYearLabel: string;
  authorLabel: string;
  publisherLabel: string;
  isbnLabel: string;
  sourceLabel: string;
  verifiedSource: string;
  verificationRequired: string;
  verificationDisclaimer: string;
  navCatalog: string;
  navEJournals: string;
  navOnos: string;
  navOffCampus: string;
  navFaq: string;
  navResearchTools: string;
  navKohaGuide: string;
  filterAll: string;
  filterForensics: string;
  filterCyber: string;
  filterLaw: string;
  citationGenerator: string;
  booleanBuilder: string;
  literatureReview: string;
  copyCitation: string;
  citationCopied: string;
  themeToggle: string;
  languageSelect: string;
  clearHistory: string;
  searchHistory: string;
  voiceInput: string;
  listening: string;
  stopListening: string;
  errorGeneric: string;
  aiThinking: string;
  quotaWarning: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: "NFSU KnowledgeGate",
    appSubtitle: "AI-Powered Academic & Research Library Assistant",
    universityName: "National Forensic Sciences University",
    libraryName: "Central Library & Information Centre",
    searchPlaceholder: "Search books, topics, DOIs, authors, or forensic disciplines...",
    askAssistant: "Ask Research AI",
    heroBadge: "Govt. of India • Institution of National Importance",
    heroTitle: "Empowering Forensic & Cyber Research with",
    heroHighlight: "Intelligent Discovery",
    heroDescription: "Seamlessly navigate NFSU's scholarly resources, explore global bibliographic records via Open Library, access ONOS e-journals, and receive verified academic assistance.",
    quickSearch: "Quick Search",
    exploreCatalog: "Explore Catalogue",
    openChat: "Open Research Assistant",
    closeChat: "Close Assistant",
    chatWelcomeTitle: "Welcome to NFSU Library Research Assistant",
    chatWelcomeSubtitle: "I can help you discover books, formulate research queries, format citations, and navigate campus resources.",
    suggestedQuestions: [
      "Find books on Digital Forensics & Incident Response",
      "How do I access ONOS e-journals from off-campus?",
      "Generate a Boolean query for Ransomware threat hunting",
      "Format an IEEE citation for a cyber forensics paper",
      "Is Spencer's Introduction to Forensic Science available?"
    ],
    inputPlaceholder: "Ask about books, e-resources, citations, or library services...",
    send: "Send",
    searchingBooks: "Searching Open Library & bibliographic catalogue...",
    foundResults: "Found bibliographic records",
    noResults: "No bibliographic records found matching your query.",
    viewOnOpenLibrary: "View on Open Library",
    checkKohaAvailability: "Check Physical Copy on NFSU KOHA",
    kohaDisclaimer: "Note: Live physical holdings at NFSU Gandhinagar and regional campuses are managed in the official KOHA OPAC. Live checkout availability is not connected via public API.",
    openLibraryNotice: "Bibliographic data retrieved via Open Library public catalogue. 'First Publish' reflects the earliest known work, not a specific modern edition.",
    earliestPubYearLabel: "First Published (Earliest Work)",
    editionYearLabel: "Edition Year",
    authorLabel: "Author(s)",
    publisherLabel: "Publisher",
    isbnLabel: "ISBN",
    sourceLabel: "Catalogue Source",
    verifiedSource: "Verified Official Source",
    verificationRequired: "Verification Required (Institutional Policy)",
    verificationDisclaimer: "Institutional loan limits, fine schedules, and special holiday hours require official verification with the library circulation desk.",
    navCatalog: "Catalogue Search",
    navEJournals: "E-Journals",
    navOnos: "ONOS Portal",
    navOffCampus: "Off-Campus IDP",
    navFaq: "Verified FAQs",
    navResearchTools: "Research Suite",
    navKohaGuide: "KOHA Integration",
    filterAll: "All Fields",
    filterForensics: "Forensic Science",
    filterCyber: "Cyber Security",
    filterLaw: "Criminology & Law",
    citationGenerator: "Citation Assistant",
    booleanBuilder: "Boolean Query Builder",
    literatureReview: "Literature Review Roadmap",
    copyCitation: "Copy Citation",
    citationCopied: "Copied to Clipboard!",
    themeToggle: "Toggle Theme",
    languageSelect: "Language",
    clearHistory: "Clear Chat",
    searchHistory: "Search Conversation",
    voiceInput: "Voice Input",
    listening: "Listening...",
    stopListening: "Stop",
    errorGeneric: "Unable to retrieve records. Fallback catalogue loaded.",
    aiThinking: "Synthesizing research guidance...",
    quotaWarning: "Gemini quota or key not supplied. Using verified local reasoning engine."
  },
  hi: {
    appName: "एनएफएसयू नॉलेजगेट",
    appSubtitle: "एआई-संचालित शैक्षणिक एवं अनुसंधान पुस्तकालय सहायक",
    universityName: "राष्ट्रीय न्यायालयिक विज्ञान विश्वविद्यालय",
    libraryName: "केंद्रीय पुस्तकालय एवं सूचना केंद्र",
    searchPlaceholder: "पुस्तकें, विषय, डीओआई, लेखक या फोरेंसिक विषय खोजें...",
    askAssistant: "अनुसंधान एआई से पूछें",
    heroBadge: "भारत सरकार • राष्ट्रीय महत्व का संस्थान",
    heroTitle: "न्यायालयिक और साइबर अनुसंधान को सशक्त बनाएं",
    heroHighlight: "बुद्धिमान ज्ञान खोज",
    heroDescription: "एनएफएसयू के विद्वत्तापूर्ण संसाधनों को खोजें, ओपन लाइब्रेरी से वैश्विक ग्रंथसूची रिकॉर्ड देखें, ओएनओएस ई-पत्रिकाओं तक पहुंचें और सत्यापित सहायता प्राप्त करें।",
    quickSearch: "त्वरित खोज",
    exploreCatalog: "कैटलॉग देखें",
    openChat: "अनुसंधान सहायक खोलें",
    closeChat: "सहायक बंद करें",
    chatWelcomeTitle: "एनएफएसयू पुस्तकालय अनुसंधान सहायक में आपका स्वागत है",
    chatWelcomeSubtitle: "मैं पुस्तकें खोजने, अनुसंधान क्वेरी तैयार करने, उद्धरण प्रारूपित करने और परिसर संसाधनों को नेविगेट करने में मदद कर सकता हूँ।",
    suggestedQuestions: [
      "डिजिटल फोरेंसिक और इंसीडेंट रिस्पॉन्स पर पुस्तकें खोजें",
      "परिसर के बाहर से ONOS ई-पत्रिकाओं तक कैसे पहुंचें?",
      "रैनसमवेयर विश्लेषण के लिए बूलियन क्वेरी बनाएं",
      "साइबर फोरेंसिक शोधपत्र के लिए IEEE उद्धरण तैयार करें",
      "क्या जेम्स स्पेंसर की फोरेंसिक साइंस पुस्तक उपलब्ध है?"
    ],
    inputPlaceholder: "पुस्तकों, ई-संसाधनों, उद्धरणों या पुस्तकालय सेवाओं के बारे में पूछें...",
    send: "भेजें",
    searchingBooks: "ओपन लाइब्रेरी और ग्रंथसूची कैटलॉग खोज रहे हैं...",
    foundResults: "ग्रंथसूची रिकॉर्ड मिले",
    noResults: "आपकी खोज से मेल खाने वाले कोई रिकॉर्ड नहीं मिले।",
    viewOnOpenLibrary: "ओपन लाइब्रेरी पर देखें",
    checkKohaAvailability: "एनएफएसयू कोहा पर भौतिक प्रति जांचें",
    kohaDisclaimer: "नोट: एनएफएसयू में वास्तविक प्रतियों की स्थिति आधिकारिक कोहा ओपैक में प्रबंधित की जाती है। भौतिक उपलब्धता सार्वजनिक एपीआई से सीधे जुड़ी नहीं है।",
    openLibraryNotice: "ओपन लाइब्रेरी सार्वजनिक कैटलॉग से प्राप्त डेटा। 'प्रथम प्रकाशन' कार्य का सबसे प्रारंभिक वर्ष दर्शाता है।",
    earliestPubYearLabel: "प्रथम प्रकाशन वर्ष (प्रारंभिक संस्करण)",
    editionYearLabel: "संस्करण वर्ष",
    authorLabel: "लेखक",
    publisherLabel: "प्रकाशक",
    isbnLabel: "आईएसबीएन",
    sourceLabel: "कैटलॉग स्रोत",
    verifiedSource: "सत्यापित आधिकारिक स्रोत",
    verificationRequired: "सत्यापन आवश्यक (संस्थागत नीति)",
    verificationDisclaimer: "ऋण सीमा, जुर्माना और छुट्टियों के समय के लिए आधिकारिक पुस्तकालय डेस्क से पुष्टि आवश्यक है।",
    navCatalog: "कैटलॉग खोज",
    navEJournals: "ई-पत्रिकाएं",
    navOnos: "ONOS पोर्टल",
    navOffCampus: "ऑफ-कैंपस आईडीपी",
    navFaq: "सत्यापित एफएक्यू",
    navResearchTools: "अनुसंधान उपकरण",
    navKohaGuide: "कोहा एकीकरण",
    filterAll: "सभी क्षेत्र",
    filterForensics: "न्यायालयिक विज्ञान",
    filterCyber: "साइबर सुरक्षा",
    filterLaw: "अपराधशास्त्र एवं विधि",
    citationGenerator: "उद्धरण सहायक",
    booleanBuilder: "बूलियन क्वेरी निर्माता",
    literatureReview: "साहित्य समीक्षा रोडमैप",
    copyCitation: "उद्धरण कॉपी करें",
    citationCopied: "क्लिपबोर्ड पर कॉपी किया गया!",
    themeToggle: "थीम बदलें",
    languageSelect: "भाषा",
    clearHistory: "चैट साफ़ करें",
    searchHistory: "बातचीत खोजें",
    voiceInput: "ध्वनि इनपुट",
    listening: "सुन रहे हैं...",
    stopListening: "रोकें",
    errorGeneric: "रिकॉर्ड लोड करने में असमर्थ। बैकअप कैटलॉग लोड किया गया।",
    aiThinking: "अनुसंधान मार्गदर्शन तैयार कर रहे हैं...",
    quotaWarning: "जेमिनी कुंजी उपलब्ध नहीं है। स्थानीय तर्क इंजन का उपयोग किया जा रहा है।"
  },
  gu: {
    appName: "NFSU નોલેજગેટ",
    appSubtitle: "AI-સંચાલિત શૈક્ષણિક અને સંશોધન પુસ્તકાલય સહાયક",
    universityName: "રાષ્ટ્રીય ફોરેન્સિક સાયન્સ યુનિવર્સિટી",
    libraryName: "સેન્ટ્રલ લાઇબ્રેરી એન્ડ ઇન્ફોર્મેશન સેન્ટર",
    searchPlaceholder: "પુસ્તકો, વિષયો, DOI, લેખકો અથવા ફોરેન્સિક વિષયો શોધો...",
    askAssistant: "સંશોધન AI ને પૂછો",
    heroBadge: "ભારત સરકાર • રાષ્ટ્રીય મહત્વની સંસ્થા",
    heroTitle: "ફોરેન્સિક અને સાયબર સંશોધનને સક્ષમ બનાવો",
    heroHighlight: "બુદ્ધિશાળી જ્ઞાન શોધ",
    heroDescription: "NFSU ના સંશોધન સંસાધનો શોધો, ઓપન લાઇબ્રેરી દ્વારા વૈશ્વિક પુસ્તકો જુઓ, ONOS ઇ-જર્નલ્સ મેળવો અને ચકાસાયેલ શૈક્ષણિક સહાય મેળવો.",
    quickSearch: "ઝડપી શોધ",
    exploreCatalog: "કેટલોગ જુઓ",
    openChat: "સંશોધન સહાયક ખોલો",
    closeChat: "સહાયક બંધ કરો",
    chatWelcomeTitle: "NFSU લાઇબ્રેરી રિસર્ચ આસિસ્ટન્ટમાં આપનું સ્વાગત છે",
    chatWelcomeSubtitle: "હું પુસ્તકો શોધવા, સંશોધન પ્રશ્નો તૈયાર કરવા, સંદર્ભ બનાવવામાં અને સંસાધનો શોધવામાં મદદ કરી શકું છું.",
    suggestedQuestions: [
      "ડિજિટલ ફોરેન્સિક્સ અને ઇન્સિડેન્ટ રિસ્પોન્સ પર પુસ્તકો શોધો",
      "કેમ્પસ બહારથી ONOS ઈ-જર્નલ્સ કેવી રીતે એક્સેસ કરવા?",
      "રેન્સમવેર વિશ્લેષણ માટે બુલિયન ક્વેરી બનાવો",
      "સાયબર ફોરેન્સિક્સ પેપર માટે IEEE સાઇટેશન બનાવો",
      "શું જેમ્સ સ્પેન્સરનું ફોરેન્સિક સાયન્સ પુસ્તક ઉપલબ્ધ છે?"
    ],
    inputPlaceholder: "પુસ્તકો, ઈ-સંસાધનો, સાઇટેશન અથવા લાઇબ્રેરી સેવાઓ વિશે પૂછો...",
    send: "મોકલો",
    searchingBooks: "ઓપન લાઇબ્રેરી અને કેટલોગ શોધી રહ્યા છીએ...",
    foundResults: "પુસ્તક રેકોર્ડ્સ મળ્યા",
    noResults: "કોઈ રેકોર્ડ મળ્યા નથી.",
    viewOnOpenLibrary: "ઓપન લાઇબ્રેરી પર જુઓ",
    checkKohaAvailability: "NFSU કોહા પર ભૌતિક નકલ તપાસો",
    kohaDisclaimer: "નોંધ: NFSU ખાતે ભૌતિક પુસ્તકોની વિગતો સત્તાવાર KOHA OPAC માં સંચાલિત થાય છે. જીવંત ઉપલબ્ધતા પબ્લિક API સાથે જોડાયેલ નથી.",
    openLibraryNotice: "ઓપન લાઇબ્રેરી સાર્વજનિક કેટલોગમાંથી મેળવેલ ડેટા. 'પ્રથમ પ્રકાશન' સૌથી પ્રારંભિક કાર્ય વર્ષ દર્શાવે છે.",
    earliestPubYearLabel: "પ્રથમ પ્રકાશન વર્ષ",
    editionYearLabel: "આવૃત્તિ વર્ષ",
    authorLabel: "લેખક",
    publisherLabel: "પ્રકાશક",
    isbnLabel: "ISBN",
    sourceLabel: "સ્ત્રોત",
    verifiedSource: "ચકાસાયેલ સત્તાવાર સ્ત્રોત",
    verificationRequired: "ચકાસણી જરૂરી (સંસ્થાકીય નીતિ)",
    verificationDisclaimer: "પુસ્તક લોન મર્યાદા, દંડ અને રજાઓના સમય માટે લાઇબ્રેરી ડેસ્ક પરથી પુષ્ટિ જરૂરી છે.",
    navCatalog: "કેટલોગ શોધ",
    navEJournals: "ઈ-જર્નલ્સ",
    navOnos: "ONOS પોર્ટલ",
    navOffCampus: "ઓફ-કેમ્પસ IDP",
    navFaq: "સત્તાવાર પ્રશ્નોત્તરી",
    navResearchTools: "સંશોધન સાધનો",
    navKohaGuide: "KOHA માર્ગદર્શિકા",
    filterAll: "બધા ક્ષેત્રો",
    filterForensics: "ફોરેન્સિક સાયન્સ",
    filterCyber: "સાયબર સિક્યુરિટી",
    filterLaw: "ક્રિમિનોલોજી અને કાયદો",
    citationGenerator: "સાઇટેશન સહાયક",
    booleanBuilder: "બુલિયન ક્વેરી બિલ્ડર",
    literatureReview: "લિટરેચર રિવ્યુ રોડમેપ",
    copyCitation: "સાઇટેશન કોપી કરો",
    citationCopied: "ક્લિપબોર્ડ પર કોપી થયું!",
    themeToggle: "થીમ બદલો",
    languageSelect: "ભાષા",
    clearHistory: "ચેટ સાફ કરો",
    searchHistory: "વાતચીત શોધો",
    voiceInput: "વોઇસ ઇનપુટ",
    listening: "સાંભળી રહ્યા છીએ...",
    stopListening: "રોકો",
    errorGeneric: "રેકોર્ડ્સ લાવવામાં અસમર્થ. બેકઅપ કેટલોગ દર્શાવેલ છે.",
    aiThinking: "સંશોધન માર્ગદર્શન તૈયાર થઈ રહ્યું છે...",
    quotaWarning: "જેમિની કી ઉપલબ્ધ નથી. સ્થાનિક બુદ્ધિમત્તા એન્જિનનો ઉપયોગ થઈ રહ્યો છે."
  }
};
