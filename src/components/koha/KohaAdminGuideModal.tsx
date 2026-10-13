import React, { useState } from 'react';
import { 
  X, 
  Code, 
  Copy, 
  Check, 
  ShieldCheck, 
  Terminal, 
  Server, 
  RotateCcw, 
  Layers, 
  AlertCircle 
} from 'lucide-react';

interface KohaAdminGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KohaAdminGuideModal: React.FC<KohaAdminGuideModalProps> = ({
  isOpen,
  onClose
}) => {
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2500);
  };

  const kohaSnippet = `<!-- NFSU KnowledgeGate AI Research Assistant Widget -->
<!-- Paste into Koha System Preference: opacuserjs -->
<script>
(function() {
  var s = document.createElement('script');
  s.src = 'https://librarychatbot.vercel.app/nfsu-library-widget.js';
  s.async = true;
  s.defer = true;
  document.head.appendChild(s);
})();
</script>`;

  const cspHeader = `Content-Security-Policy: default-src 'self' https://catalog.nfsu.ac.in; script-src 'self' 'unsafe-inline' https://librarychatbot.vercel.app; connect-src 'self' https://librarychatbot.vercel.app https://openlibrary.org https://generativelanguage.googleapis.com; img-src 'self' data: https://covers.openlibrary.org https://librarychatbot.vercel.app; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#0c1527] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#0b1f3a] to-[#16325c] text-white flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display">
                KOHA OPAC Integration Guide for Administrators
              </h3>
              <p className="text-xs text-slate-300">
                Non-intrusive widget deployment without modifying KOHA core Perl or template files
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 dark:text-slate-300">
          {/* Architecture Overview */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start space-x-3 text-amber-900 dark:text-amber-300">
            <ShieldCheck className="w-5 h-5 flex-shrink-0 text-amber-500 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">Zero Core Modification Architecture:</span>
              <p className="text-[11px] leading-relaxed">
                The AI Research Assistant is designed to be injected purely via Koha&apos;s standard administrative preference (<code className="bg-amber-500/20 px-1 py-0.5 rounded">opacuserjs</code>). It requires zero modifications to Koha core files, database schemas, or Apache/Plack configs.
              </p>
            </div>
          </div>

          {/* Step 1: Widget Insertion */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-bold">1</span>
              <span>Supported Widget Insertion (Koha Staff Client)</span>
            </h4>
            <p className="text-slate-600 dark:text-slate-400">
              Navigate to <strong>Koha Administration &gt; Global system preferences &gt; OPAC &gt; Features &gt; opacuserjs</strong> and paste the snippet below:
            </p>

            <div className="relative">
              <pre className="p-3.5 rounded-xl bg-slate-950 text-amber-400 font-mono text-[11px] overflow-x-auto border border-slate-800">
                {kohaSnippet}
              </pre>
              <button
                onClick={() => handleCopy('koha', kohaSnippet)}
                className="absolute top-2.5 right-2.5 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white text-[10px] flex items-center space-x-1"
              >
                {copiedSnippet === 'koha' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSnippet === 'koha' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Step 2: Content Security Policy (CSP) */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-bold">2</span>
              <span>Content Security Policy (CSP) Directives</span>
            </h4>
            <p className="text-slate-600 dark:text-slate-400">
              If your Koha Apache/Nginx web server enforces strict CSP headers, whitelist the assistant domain:
            </p>

            <div className="relative">
              <pre className="p-3.5 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto border border-slate-800 break-all whitespace-pre-wrap">
                {cspHeader}
              </pre>
              <button
                onClick={() => handleCopy('csp', cspHeader)}
                className="absolute top-2.5 right-2.5 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white text-[10px] flex items-center space-x-1"
              >
                {copiedSnippet === 'csp' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSnippet === 'csp' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Step 3: Backend Hosting & Environment Variables */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-bold">3</span>
              <span>Backend Hosting & Future Koha REST API Connection</span>
            </h4>
            <p className="text-slate-600 dark:text-slate-400">
              Host the Vercel backend serverless function or campus Node container. When authorized API access is provided by NFSU IT:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
              <li>Set <code className="text-amber-500 font-mono">CATALOGUE_PROVIDER=koha</code> in the backend environment.</li>
              <li>Provide <code className="text-amber-500 font-mono">KOHA_API_ENDPOINT=https://catalog.nfsu.ac.in/api/v1</code> and client credentials.</li>
              <li>Live shelf status and barcode accession verification will activate automatically.</li>
            </ul>
          </div>

          {/* Step 4: Testing & Rollback */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <h5 className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                <Terminal className="w-4 h-4 text-emerald-500" />
                <span>Testing Procedure</span>
              </h5>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Open Koha OPAC in an incognito window with DevTools Console open. Confirm that the floating AI button appears at bottom-right and test queries. Verify that no CSP or CORS violations appear in console logs.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <h5 className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                <RotateCcw className="w-4 h-4 text-red-500" />
                <span>Zero-Downtime Rollback</span>
              </h5>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                To immediately remove the assistant from Koha, simply delete the 6-line script block from Koha <code className="text-amber-500">opacuserjs</code> and click Save. Koha OPAC will instantly revert without restarting Apache or Koha services.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-[#080e1c] border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
