export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const isGeminiSet = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here';

  return res.status(200).json({
    status: 'healthy',
    university: 'National Forensic Sciences University (NFSU)',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    providers: {
      openLibrary: 'active',
      curatedFallback: 'active',
      kohaILS: 'modular-ready (disabled until credentials configured)'
    },
    aiEngine: {
      geminiConfigured: isGeminiSet,
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
      localReasoningEngine: 'active'
    },
    kohaOpacUrl: process.env.KOHA_OPAC_URL || 'https://catalog.nfsu.ac.in'
  });
}
