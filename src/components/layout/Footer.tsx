import React from 'react';
import { 
  ShieldCheck, 
  ExternalLink, 
  Library, 
  FileText, 
  Lock, 
  Globe 
} from 'lucide-react';
import { Language } from '../../types';
import { translations } from '../../i18n/translations';

interface FooterProps {
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  const t = translations[language];

  return (
    <footer className="mt-20 bg-slate-900 dark:bg-[#060b14] text-slate-300 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: University Identity */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white font-display">
                  National Forensic Sciences University
                </h4>
                <p className="text-[11px] text-amber-400 font-mono">
                  An Institution of National Importance • Ministry of Home Affairs, Govt. of India
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              NFSU KnowledgeGate is an AI-powered Personalised Research Assistant designed for the NFSU Library Hackathon. It bridges global bibliographic discovery with official university repositories and electronic journal databases.
            </p>
            <div className="pt-2 text-[11px] text-slate-500 font-mono">
              Sector 9, Gandhinagar - 382007, Gujarat, India
            </div>
          </div>

          {/* Column 2: Official Portals */}
          <div className="space-y-3 text-xs">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Institutional Portals
            </h5>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a 
                  href="https://catalog.nfsu.ac.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors flex items-center space-x-1"
                >
                  <span>NFSU KOHA OPAC</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://idp.nfsu.edu.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors flex items-center space-x-1"
                >
                  <span>INFED-IDP SSO (Off-Campus)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://nfsu.refread.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors flex items-center space-x-1"
                >
                  <span>RefRead (Law E-Library)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://onos.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors flex items-center space-x-1"
                >
                  <span>ONOS Portal (INFLIBNET)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Academic Resources */}
          <div className="space-y-3 text-xs">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">
              E-Resource Subscriptions
            </h5>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a 
                  href="https://ieeexplore.ieee.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors flex items-center space-x-1"
                >
                  <span>IEEE Xplore</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://sciencedirect.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors flex items-center space-x-1"
                >
                  <span>Elsevier ScienceDirect</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://manupatrafast.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors flex items-center space-x-1"
                >
                  <span>Manupatra Law Suite</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://turnitin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors flex items-center space-x-1"
                >
                  <span>Turnitin Similarity System</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Privacy Notice & Security Disclaimer */}
        <div className="mt-10 pt-6 border-t border-slate-800 text-[11px] text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              <strong>Privacy Notice:</strong> Conversations are processed for real-time research assistance without persistent storage of personal data. External records are fetched from public Open Library APIs.
            </span>
          </div>

          <div className="text-slate-400 text-center md:text-right">
            © {new Date().getFullYear()} National Forensic Sciences University Library • Hackathon Build
          </div>
        </div>
      </div>
    </footer>
  );
};
