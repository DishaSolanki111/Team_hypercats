import { verifiedFAQs } from '../src/data/faqs';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const category = req.query?.category;
  let items = verifiedFAQs;

  if (category) {
    items = items.filter(f => f.category === category);
  }

  return res.status(200).json({
    total: items.length,
    faqs: items,
    sources: [
      { name: "NFSU KOHA OPAC", url: "https://catalog.nfsu.ac.in" },
      { name: "NFSU INFED IDP", url: "https://idp.nfsu.edu.in" },
      { name: "ONOS Portal (Govt. of India / INFLIBNET)", url: "https://onos.gov.in/how-to-access" },
      { name: "NFSU Law RefRead", url: "https://nfsu.refread.com" }
    ]
  });
}
