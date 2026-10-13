export interface CitationResult {
  style: 'APA' | 'MLA' | 'IEEE';
  citation: string;
  bibtex: string;
  inTextCitation: string;
}

export interface BooleanQueryResult {
  topic: string;
  queryString: string;
  scopusQuery: string;
  ieeQuery: string;
  explanation: string;
  facets: {
    primaryConcepts: string[];
    synonyms: string[];
    exclusions: string[];
  };
}

export interface LiteratureReviewRoadmap {
  topic: string;
  steps: {
    phase: string;
    description: string;
    recommendedTools: string[];
    tips: string[];
  }[];
}

export class AcademicResearchAssistant {
  generateCitation(
    title: string,
    authors: string[],
    year: number = new Date().getFullYear(),
    publisher: string = "Academic Press",
    style: 'APA' | 'MLA' | 'IEEE' = 'IEEE'
  ): CitationResult {
    const primaryAuthor = authors[0] || "Author, A.";
    const cleanAuthors = authors.length > 0 ? authors : ["Unknown Author"];

    // Format author names
    const formatAuthorsAPA = (list: string[]) => {
      if (list.length === 1) return list[0];
      if (list.length === 2) return `${list[0]} & ${list[1]}`;
      return `${list[0]} et al.`;
    };

    const formatAuthorsIEEE = (list: string[]) => {
      if (list.length === 1) return list[0];
      if (list.length === 2) return `${list[0]} and ${list[1]}`;
      if (list.length > 2) return `${list[0]} et al.`;
      return list[0];
    };

    const formatAuthorsMLA = (list: string[]) => {
      if (list.length === 1) return list[0];
      if (list.length === 2) return `${list[0]}, and ${list[1]}`;
      return `${list[0]}, et al.`;
    };

    let citation = "";
    let inTextCitation = "";
    const bibtexKey = `${(primaryAuthor.split(" ").pop() || "source").toLowerCase()}${year}`;

    switch (style) {
      case 'APA':
        citation = `${formatAuthorsAPA(cleanAuthors)} (${year}). ${title}. ${publisher}.`;
        inTextCitation = `(${primaryAuthor.split(" ").pop() || "Author"}, ${year})`;
        break;

      case 'MLA':
        citation = `${formatAuthorsMLA(cleanAuthors)}. "${title}." ${publisher}, ${year}.`;
        inTextCitation = `(${primaryAuthor.split(" ").pop() || "Author"})`;
        break;

      case 'IEEE':
      default:
        citation = `${formatAuthorsIEEE(cleanAuthors)}, "${title}," ${publisher}, ${year}.`;
        inTextCitation = `[1]`;
        break;
    }

    const bibtex = `@book{${bibtexKey},
  author    = {${cleanAuthors.join(" and ")}},
  title     = {${title}},
  year      = {${year}},
  publisher = {${publisher}}
}`;

    return {
      style,
      citation,
      bibtex,
      inTextCitation
    };
  }

  generateBooleanQuery(topic: string): BooleanQueryResult {
    const cleanTopic = topic.trim();
    const lower = cleanTopic.toLowerCase();

    let primary = "digital forensics";
    let synonyms = ["computer forensics", "electronic evidence", "incident response"];
    let exclusions = ["anonymity", "black hat"];

    if (lower.includes("ransomware") || lower.includes("malware")) {
      primary = "ransomware";
      synonyms = ["crypto-malware", "extortionware", "malware analysis", "reverse engineering"];
      exclusions = ["marketing", "ransom payout scam"];
    } else if (lower.includes("memory") || lower.includes("volatility")) {
      primary = "memory forensics";
      synonyms = ["volatile memory analysis", "RAM dump", "process injection detection"];
      exclusions = ["cognitive memory", "psychological memory"];
    } else if (lower.includes("dna") || lower.includes("genetics")) {
      primary = "forensic DNA typing";
      synonyms = ["STR analysis", "short tandem repeats", "capillary electrophoresis", "NGS"];
      exclusions = ["agricultural genetics", "plant breeding"];
    } else if (lower.includes("toxicology") || lower.includes("poison")) {
      primary = "forensic toxicology";
      synonyms = ["postmortem toxicology", "GC-MS screening", "LC-MS/MS", "drug overdose"];
      exclusions = ["environmental remediation", "crop spraying"];
    } else if (lower.includes("ballistics") || lower.includes("gunshot")) {
      primary = "forensic ballistics";
      synonyms = ["firearms identification", "gunshot residue", "GSR analysis", "bullet trajectory"];
      exclusions = ["gaming physics", "military artillery"];
    } else if (lower.includes("cloud") || lower.includes("aws") || lower.includes("azure")) {
      primary = "cloud forensics";
      synonyms = ["cloud computing evidence", "multi-tenant logging", "AWS CloudTrail forensics", "virtualized artifact recovery"];
      exclusions = ["weather forecasting", "cloud seeding"];
    }

    const queryParts = [
      `("${primary}" OR ${synonyms.map(s => `"${s}"`).join(" OR ")})`,
      `AND ("investigation" OR "evidence" OR "analysis" OR "detection")`,
      `NOT (${exclusions.map(e => `"${e}"`).join(" OR ")})`
    ];

    const queryString = queryParts.join(" ");
    const scopusQuery = `TITLE-ABS-KEY(("${primary}" OR ${synonyms.slice(0, 2).map(s => `"${s}"`).join(" OR ")}) AND ("investigation" OR "detection"))`;
    const ieeQuery = `(("${primary}") AND ("forensics" OR "detection"))`;

    return {
      topic: cleanTopic,
      queryString,
      scopusQuery,
      ieeQuery,
      explanation: `This query combines your core domain term with high-precision synonyms using the OR operator, narrows results to empirical investigations using AND, and filters out non-forensic noise using NOT.`,
      facets: {
        primaryConcepts: [primary],
        synonyms,
        exclusions
      }
    };
  }

  getLiteratureReviewRoadmap(topic: string): LiteratureReviewRoadmap {
    return {
      topic,
      steps: [
        {
          phase: "1. Scope & Research Questions",
          description: "Define boundaries, PICO/SPIDER criteria, and formulate 2-3 specific research questions for forensic/cyber domains.",
          recommendedTools: ["BioRender", "Miro", "Notion"],
          tips: ["Avoid overly broad questions. Focus on specific forensic methodologies, artifacts, or evidentiary admissibility."]
        },
        {
          phase: "2. Comprehensive Database Search",
          description: "Execute targeted Boolean searches across institutional repositories, ONOS national subscriptions, and specialized indexing databases.",
          recommendedTools: ["IEEE Xplore", "Elsevier ScienceDirect", "J-Gate Plus", "ONOS Portal (onos.gov.in)"],
          tips: ["Export citation files (.RIS, .BibTeX) and record search strings with date of retrieval for methodology reporting."]
        },
        {
          phase: "3. Screening & PRISMA De-duplication",
          description: "Filter articles based on title, abstract, and inclusion/exclusion criteria. Track included vs excluded studies in a PRISMA flow chart.",
          recommendedTools: ["Rayyan", "Zotero", "Mendeley"],
          tips: ["De-duplicate identical conference and journal reprints across multiple publishers."]
        },
        {
          phase: "4. Data Extraction & Synthesis Matrix",
          description: "Extract methodology, forensic artifacts examined, datasets/testbeds used, accuracy/F1-scores, and key limitations into a structured matrix.",
          recommendedTools: ["Excel / Google Sheets Synthesis Matrix", "Turnitin"],
          tips: ["Group findings by thematic approaches rather than paper-by-paper summaries."]
        },
        {
          phase: "5. Critical Appraisal & Writing",
          description: "Synthesize research gaps, legal challenges (e.g., Indian Evidence Act / BNSS 2023 compliance, chain of custody), and future directions.",
          recommendedTools: ["Grammarly (NFSU Subscription)", "Turnitin (NFSU Subscription)"],
          tips: ["Always verify DOI metadata directly. Ensure similarity index remains below NFSU postgraduate threshold (typically < 10%)."]
        }
      ]
    };
  }
}

export const academicAssistant = new AcademicResearchAssistant();
