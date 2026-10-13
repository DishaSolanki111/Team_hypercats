import { FAQItem } from '../types';

export const verifiedFAQs: FAQItem[] = [
  {
    id: "faq-onos-access",
    category: "onos",
    question: {
      en: "How do I access research journals under the One Nation One Subscription (ONOS) initiative?",
      hi: "वन नेशन वन सब्सक्रिप्शन (ONOS) के तहत शोध पत्रिकाओं तक कैसे पहुंचें?",
      gu: "વન નેશન વન સબ્સ્ક્રિપ્શન (ONOS) હેઠળ સંશોધન જર્નલ્સ કેવી રીતે એક્સેસ કરવા?"
    },
    answer: {
      en: "Under ONOS (MoE Govt. of India / INFLIBNET initiative), access is available via two methods: (1) On-Campus: Any system connected to the NFSU campus-wide network with institutional static IP automatically receives full-text access without individual registration. (2) Off-Campus: Access through INFED (Shibboleth-based Identity Provider) at https://idp.nfsu.edu.in using your institutional NFSU user ID and password. For any access issues, contact support@onos.gov.in or the NFSU Central Library.",
      hi: "ONOS (शिक्षा मंत्रालय भारत सरकार / INFLIBNET पहल) के तहत दो तरीकों से पहुंच उपलब्ध है: (1) परिसर में: NFSU संस्थागत स्टेटिक आईपी से जुड़े किसी भी उपकरण पर बिना अलग पंजीकरण के स्वचालित पहुंच मिलती है। (2) परिसर के बाहर: https://idp.nfsu.edu.in पर INFED (शिबोलेथ-आधारित आईडीपी) के माध्यम से अपनी NFSU आईडी और पासवर्ड का उपयोग करके पहुंच प्राप्त करें।",
      gu: "ONOS (શિક્ષણ મંત્રાલય ભારત સરકાર / INFLIBNET પહેલ) હેઠળ બે રીતે ઍક્સેસ ઉપલબ્ધ છે: (1) કેમ્પસમાં: NFSU કેમ્પસ નેટવર્ક સાથે જોડાયેલ કોઈપણ કમ્પ્યુટર પર અલગ નોંધણી વગર આપમેળે ઍક્સેસ મળે છે. (2) કેમ્પસ બહાર: https://idp.nfsu.edu.in પર INFED દ્વારા તમારી સંસ્થાકીય ID અને પાસવર્ડ વડે ઍક્સેસ કરો."
    },
    sourceUrl: "https://onos.gov.in/how-to-access",
    sourceTitle: "ONOS Official Access Portal (Govt. of India / INFLIBNET)",
    verificationStatus: "verified",
    lastCheckedDate: "2026-03-15",
    keywords: ["onos", "one nation one subscription", "journals", "inflibnet", "off campus", "static ip", "full text"]
  },
  {
    id: "faq-idp-offcampus",
    category: "idp_access",
    question: {
      en: "How can I access digital library resources from outside the university campus?",
      hi: "विश्वविद्यालय परिसर के बाहर से डिजिटल लाइब्रेरी संसाधनों तक कैसे पहुंचें?",
      gu: "યુનિવર્સિટી કેમ્પસ બહારથી ડિજિટલ લાઇબ્રેરી સંસાધનો કેવી રીતે એક્સેસ કરવા?"
    },
    answer: {
      en: "NFSU provides secure remote access via INFED-IDP Single Sign-On (SSO) at https://idp.nfsu.edu.in. Log in using your official university credentials (@nfsu.ac.in). For specialized Law library e-resources, off-campus access is provided through RefRead at https://nfsu.refread.com. If your account is not activated, contact the Central Library nodal officer.",
      hi: "NFSU https://idp.nfsu.edu.in पर INFED-IDP सिंगल साइन-ऑन (SSO) के माध्यम से सुरक्षित रिमोट एक्सेस प्रदान करता है। अपनी आधिकारिक विश्वविद्यालय साख (@nfsu.ac.in) का उपयोग करके लॉग इन करें। विधि ई-संसाधनों के लिए https://nfsu.refread.com पर RefRead का उपयोग करें।",
      gu: "NFSU https://idp.nfsu.edu.in પર INFED-IDP સિંગલ સાઇન-ઓન (SSO) દ્વારા સુરક્ષિત રિમોટ એક્સેસ પ્રદાન કરે છે. તમારા સત્તાવાર યુનિવર્સિટી ઇમેઇલ (@nfsu.ac.in) વડે લોગિન કરો. કાયદાના સંસાધનો માટે https://nfsu.refread.com પર RefRead નો ઉપયોગ કરો."
    },
    sourceUrl: "https://idp.nfsu.edu.in",
    sourceTitle: "NFSU INFED Identity Provider (IDP SSO)",
    verificationStatus: "verified",
    lastCheckedDate: "2026-03-20",
    keywords: ["remote access", "off campus", "infed", "idp", "refread", "sso", "login"]
  },
  {
    id: "faq-koha-catalog-search",
    category: "catalogue",
    question: {
      en: "How do I search for physical books and theses in the NFSU Library catalogue?",
      hi: "NFSU पुस्तकालय कैटलॉग में भौतिक पुस्तकों और शोध प्रबंधों की खोज कैसे करें?",
      gu: "NFSU લાઇબ્રેરી કેટલોગમાં ભૌતિક પુસ્તકો અને થીસીસ કેવી રીતે શોધવા?"
    },
    answer: {
      en: "Visit the official KOHA OPAC at https://catalog.nfsu.ac.in. You can perform Simple Search by title, author, or keyword, or use 'Advanced Search' (https://catalog.nfsu.ac.in/cgi-bin/koha/opac-search.pl) to filter by item type (Books, Theses, Dissertations, Hindi Sangrah), publication year, and call number. Each record provides real-time rack location, accession number, and holding status.",
      hi: "https://catalog.nfsu.ac.in पर आधिकारिक कोहा ओपैक पर जाएं। आप शीर्षक, लेखक या कीवर्ड द्वारा सामान्य खोज कर सकते हैं, या प्रकार (पुस्तके, शोध प्रबंध, हिंदी संग्रह) और प्रकाशन वर्ष के आधार पर फ़िल्टर करने के लिए 'उन्नत खोज' का उपयोग कर सकते हैं। प्रत्येक रिकॉर्ड रैक स्थान और परिग्रहण संख्या प्रदान करता है।",
      gu: "https://catalog.nfsu.ac.in પર સત્તાવાર KOHA OPAC ની મુલાકાત લો. તમે શીર્ષક, લેખક અથવા કીવર્ડ દ્વારા સરળ શોધ કરી શકો છો અથવા 'Advanced Search' નો ઉપયોગ કરીને પુસ્તકો, થીસીસ, હિન્દી સંગ્રહ અને પ્રકાશન વર્ષ મુજબ ફિલ્ટર કરી શકો છો."
    },
    sourceUrl: "https://catalog.nfsu.ac.in",
    sourceTitle: "NFSU Koha Public Access Catalogue (OPAC)",
    verificationStatus: "verified",
    lastCheckedDate: "2026-04-01",
    keywords: ["koha", "opac", "search books", "theses", "dissertations", "accession", "call number"]
  },
  {
    id: "faq-subscribed-ejournals",
    category: "e_resources",
    question: {
      en: "Which publisher e-journal databases are subscribed by NFSU Library?",
      hi: "NFSU पुस्तकालय द्वारा किन प्रकाशक ई-जर्नल डेटाबेसों की सदस्यता ली गई है?",
      gu: "NFSU લાઇબ્રેરી દ્વારા કયા પબ્લિશર ઇ-જર્નલ ડેટાબેઝ સબ્સ્ક્રાઇબ કરવામાં આવ્યા છે?"
    },
    answer: {
      en: "NFSU Central Library subscribes to major scholarly publishers including IEEE Xplore, Elsevier ScienceDirect, Springer Nature, Wiley Online Library, ACM Digital Library, AAAS Science, ACS, Royal Society of Chemistry (RSC), Oxford Academic, Cambridge University Press, Taylor & Francis, Sage Publications, Bentham Science, BMJ, IndianJournals.com, and SPIE Digital Library. Accessible via IP-login on campus or INFED IDP off-campus.",
      hi: "NFSU केंद्रीय पुस्तकालय IEEE Xplore, Elsevier ScienceDirect, Springer Nature, Wiley Online Library, ACM Digital Library, AAAS Science, ACS, RSC, Oxford, Cambridge, Taylor & Francis, Sage, Bentham Science और IndianJournals.com की सदस्यता प्रदान करता है।",
      gu: "NFSU સેન્ટ્રલ લાઇબ્રેરી IEEE Xplore, Elsevier ScienceDirect, Springer Nature, Wiley, ACM Digital Library, AAAS Science, ACS, RSC, Oxford, Cambridge, Taylor & Francis, Sage અને IndianJournals.com સબ્સ્ક્રાઇબ કરે છે."
    },
    sourceUrl: "https://catalog.nfsu.ac.in/cgi-bin/koha/opac-page.pl?page_id=27",
    sourceTitle: "NFSU Library E-Journals Directory",
    verificationStatus: "verified",
    lastCheckedDate: "2026-03-10",
    keywords: ["ieee", "sciencedirect", "springer", "wiley", "acm", "journals", "publishers", "e-resources"]
  },
  {
    id: "faq-specialized-databases",
    category: "e_resources",
    question: {
      en: "Does the library provide access to legal databases and research analysis tools?",
      hi: "क्या पुस्तकालय कानूनी डेटाबेस और शोध विश्लेषण उपकरणों तक पहुंच प्रदान करता है?",
      gu: "શું લાઇબ્રેરી કાનૂની ડેટાબેઝ અને સંશોધન વિશ્લેષણ સાધનો પૂરા પાડે છે?"
    },
    answer: {
      en: "Yes! NFSU provides access to: (1) Law Databases: Manupatra (manupatrafast.com) and LiveLaw (livelaw.in). (2) Research & Writing Tools: Turnitin for similarity/plagiarism detection, BioRender for scientific scientific illustrations, and Grammarly for academic writing. (3) Indexing & Statistical: J-Gate Plus, JSTOR, and CMIE Prowess.",
      hi: "हाँ! NFSU निम्नलिखित तक पहुंच प्रदान करता है: (1) विधि डेटाबेस: मनुपात्र (Manupatra) और लाइव लॉ (LiveLaw)। (2) अनुसंधान उपकरण: टर्निटिन (Turnitin - साहित्यिक चोरी जांच), बायोरेन्डर (BioRender), और ग्रैमरली (Grammarly)। (3) इंडेक्सिंग: जे-गेट प्लस (J-Gate Plus), जेस्टोर (JSTOR), और सीएमआईई प्रोवेस।",
      gu: "હા! NFSU પૂરું પાડે છે: (1) કાયદા ડેટાબેઝ: મનુપાત્ર (Manupatra) અને લાઈવ લો (LiveLaw). (2) સંશોધન સાધનો: ટર્નિટિન (Turnitin - પ્લેજિઆરિઝમ તપાસ), BioRender અને Grammarly. (3) આંકડાકીય: J-Gate Plus, JSTOR અને CMIE Prowess."
    },
    sourceUrl: "https://catalog.nfsu.ac.in",
    sourceTitle: "NFSU Databases Section",
    verificationStatus: "verified",
    lastCheckedDate: "2026-03-22",
    keywords: ["manupatra", "livelaw", "turnitin", "biorender", "grammarly", "jstor", "plagiarism", "cmie"]
  },
  {
    id: "faq-accessibility-kibo",
    category: "general_rules",
    question: {
      en: "What assistive technologies are available for visually impaired students?",
      hi: "दृष्टिबाधित छात्रों के लिए कौन सी सहायक तकनीकें उपलब्ध हैं?",
      gu: "દ્રષ્ટિહીન વિદ્યાર્થીઓ માટે કઈ સહાયક ટેકનોલોજી ઉપલબ્ધ છે?"
    },
    answer: {
      en: "NFSU Central Library has deployed the KIBO Accessibility Device. KIBO allows visually impaired researchers and students to scan printed documents, books, and handwritten texts in multiple Indian and foreign languages and listen to them via audio synthesis or download as editable, accessible text.",
      hi: "NFSU केंद्रीय पुस्तकालय में KIBO एक्सेसिबिलिटी डिवाइस स्थापित है। KIBO दृष्टिबाधित शोधकर्ताओं और छात्रों को कई भारतीय और विदेशी भाषाओं में मुद्रित पुस्तकों और हस्तलिखित पाठ को स्कैन करने और ऑडियो के माध्यम से सुनने की सुविधा देता है।",
      gu: "NFSU સેન્ટ્રલ લાઇબ્રેરીમાં KIBO એક્સેસિબિલિટી ડિવાઇસ ઉપલબ્ધ છે. KIBO દ્રષ્ટિહીન વિદ્યાર્થીઓને પુસ્તકો અને દસ્તાવેજો સ્કેન કરી ઓડિયો દ્વારા સાંભળવાની સુવિધા આપે છે."
    },
    sourceUrl: "https://catalog.nfsu.ac.in/cgi-bin/koha/opac-page.pl?page_id=32",
    sourceTitle: "NFSU KIBO Accessibility Device Page",
    verificationStatus: "verified",
    lastCheckedDate: "2026-03-18",
    keywords: ["kibo", "accessibility", "visually impaired", "assistive technology", "audio reader", "divyangjan"]
  },
  {
    id: "faq-special-collections",
    category: "catalogue",
    question: {
      en: "What special printed collections are maintained in the NFSU Library?",
      hi: "NFSU पुस्तकालय में कौन से विशेष मुद्रित संग्रह उपलब्ध हैं?",
      gu: "NFSU લાઇબ્રેરીમાં કયા વિશિષ્ટ મુદ્રિત સંગ્રહો ઉપલબ્ધ છે?"
    },
    answer: {
      en: "The library maintains distinctive collections including: (1) Hindi Sangrah (हिंदी संग्रह) featuring forensic, legal, and literature works in Hindi, (2) Sardar Smriti (सरदार स्मृति) collection dedicated to nation-building and governance, (3) Namo Manthan (नमो मंथन) development series, and (4) Theses & Dissertations repository of NFSU postgraduate and doctoral research.",
      hi: "पुस्तकालय में विशेष संग्रह शामिल हैं: (1) हिंदी संग्रह (फोरेंसिक, विधि और साहित्य संबंधी पुस्तकें), (2) सरदार स्मृति संग्रह, (3) नमो मंथन विकास श्रृंखला, और (4) एनएफएसयू स्नातकोत्तर एवं डॉक्टरेट शोध प्रबंध और शोध निबंध।",
      gu: "લાઇબ્રેરીમાં વિશેષ સંગ્રહો ઉપલબ્ધ છે: (1) હિન્દી સંગ્રહ (હિન્દીમાં ફોરેન્સિક અને કાયદાકીય પુસ્તકો), (2) સરદાર સ્મૃતિ સંગ્રહ, (3) નમો મંથન શ્રેણી, અને (4) NFSU થીસીસ અને રિસર્ચ રિપોઝીટરી."
    },
    sourceUrl: "https://catalog.nfsu.ac.in",
    sourceTitle: "NFSU Print Resources Directory",
    verificationStatus: "verified",
    lastCheckedDate: "2026-03-12",
    keywords: ["hindi sangrah", "sardar smriti", "namo manthan", "theses", "dissertations", "special collection"]
  },
  {
    id: "faq-library-hours-rules",
    category: "general_rules",
    question: {
      en: "What are the exact library timings, borrowing limits, and overdue fine policies?",
      hi: "पुस्तकालय का सटीक समय, पुस्तक ऋण सीमा और विलंब शुल्क नीतियां क्या हैं?",
      gu: "લાઇબ્રેરીનો ચોક્કસ સમય, પુસ્તક ઇશ્યૂ મર્યાદા અને દંડની નીતિ શું છે?"
    },
    answer: {
      en: "[Verification Required with Official Library Desk] Specific circulation policies—such as exact borrowing quotas (student vs faculty), renewal limits, weekend reading room hours, and overdue fine amounts—are governed by institutional standing orders and subject to campus circulars. Please verify live rules directly at https://catalog.nfsu.ac.in/cgi-bin/koha/opac-page.pl?page_id=31 (Library Hours) and https://catalog.nfsu.ac.in/cgi-bin/koha/opac-page.pl?page_id=28 (Library Rules) or at the Central Library Circulation Counter.",
      hi: "[सत्यापन आवश्यक] पुस्तक ऋण सीमा, नवीनीकरण नियम, सप्ताहांत वाचनालय समय और विलंब शुल्क संस्थागत नियमों के अधीन हैं। कृपया आधिकारिक कोहा पृष्ठों (https://catalog.nfsu.ac.in/cgi-bin/koha/opac-page.pl?page_id=31) और सर्कुलेशन काउंटर से सीधे सत्यापित करें।",
      gu: "[સત્તાવાર ચકાસણી જરૂરી] પુસ્તક ઇશ્યૂ મર્યાદા, રિન્યુઅલ નિયમો અને લેટ ફી સંસ્થાકીય નીતિઓ પર આધારિત છે. કૃપા કરીને સત્તાવાર લાઇબ્રેરી પૃષ્ઠો (https://catalog.nfsu.ac.in) અથવા લાઇબ્રેરી ડેસ્ક પરથી પુષ્ટિ કરો."
    },
    sourceUrl: "https://catalog.nfsu.ac.in/cgi-bin/koha/opac-page.pl?page_id=31",
    sourceTitle: "NFSU Official Library Hours & Rules (Verification Required)",
    verificationStatus: "verification_required",
    lastCheckedDate: "2026-04-05",
    keywords: ["library hours", "timings", "fines", "borrowing limit", "renewals", "rules", "circulation"]
  },
  {
    id: "faq-citation-assistance",
    category: "citations",
    question: {
      en: "How does the AI assistant help format citations in APA, MLA, and IEEE styles?",
      hi: "एआई सहायक APA, MLA और IEEE शैलियों में संदर्भ (उद्धरण) प्रारूपित करने में कैसे मदद करता है?",
      gu: "AI સહાયક APA, MLA અને IEEE શૈલીમાં સંદર્ભ (સાઇટેશન) ફોર્મેટ કરવામાં કેવી રીતે મદદ કરે છે?"
    },
    answer: {
      en: "The assistant provides instant citation generation and validation in: (1) IEEE format (standard for Digital Forensics, Cyber Security, and Engineering papers), (2) APA 7th Edition (standard for Forensic Psychology and Criminology), and (3) MLA 9th Edition (standard for Humanities and Law). You can ask the AI to cite any book or article, or use the Citation Tool tab in the Research Suite.",
      hi: "सहायक तुरंत उद्धरण प्रारूप प्रदान करता है: (1) IEEE (डिजिटल फोरेंसिक, साइबर सुरक्षा और इंजीनियरिंग के लिए), (2) APA 7वां संस्करण (फोरेंसिक मनोविज्ञान और अपराधशास्त्र के लिए), और (3) MLA 9वां संस्करण (विधि और मानविकी के लिए)।",
      gu: "સહાયક ત્વરિત સાઇટેશન પ્રદાન કરે છે: (1) IEEE (ડિજિટલ ફોરેન્સિક્સ અને સાયબર સિક્યુરિટી), (2) APA 7મી આવૃત્તિ (ફોરેન્સિક સાયકોલોજી), અને (3) MLA 9મી આવૃત્તિ (કાયદો અને હ્યુમેનિટીઝ)."
    },
    sourceUrl: "https://catalog.nfsu.ac.in",
    sourceTitle: "NFSU Research Support Guidelines",
    verificationStatus: "verified",
    lastCheckedDate: "2026-03-30",
    keywords: ["citation", "ieee", "apa", "mla", "bibtex", "referencing", "bibliography"]
  }
];
