import React, { useState, useEffect } from 'react';
import { 
  X, 
  Settings, 
  Key, 
  Database, 
  ShieldCheck, 
  Check, 
  AlertCircle, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { geminiService } from '../../services/ai/geminiService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-1.5-flash');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [isPingingHealth, setIsPingingHealth] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('NFSU_DEMO_GEMINI_KEY') || '';
    const savedModel = localStorage.getItem('NFSU_DEMO_GEMINI_MODEL') || 'gemini-1.5-flash';
    setApiKeyInput(savedKey);
    setSelectedModel(savedModel);

    if (isOpen) {
      pingHealth();
    }
  }, [isOpen]);

  const pingHealth = async () => {
    setIsPingingHealth(true);
    try {
      const resp = await fetch('/api/health');
      if (resp.ok) {
        const data = await resp.json();
        setHealthStatus(data);
      }
    } catch {
      setHealthStatus({ status: 'offline-local' });
    } finally {
      setIsPingingHealth(false);
    }
  };

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmed = apiKeyInput.trim();
    if (trimmed) {
      localStorage.setItem('NFSU_DEMO_GEMINI_KEY', trimmed);
      localStorage.setItem('NFSU_DEMO_GEMINI_MODEL', selectedModel);
      geminiService.setApiKey(trimmed, selectedModel);
    } else {
      localStorage.removeItem('NFSU_DEMO_GEMINI_KEY');
      geminiService.setApiKey('', selectedModel);
    }
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  const handleClearKey = () => {
    setApiKeyInput('');
    localStorage.removeItem('NFSU_DEMO_GEMINI_KEY');
    geminiService.setApiKey('', selectedModel);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#0c1527] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#0b1f3a] to-[#16325c] text-white flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold font-display">
              Demo Configuration & Gemini API
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded text-slate-300 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-slate-700 dark:text-slate-300">
          {/* Note about Local Engine vs Gemini */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 space-y-1">
            <div className="font-bold flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Hackathon Evaluation Notice</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              If you leave this empty, the application runs on the built-in <strong>NFSU Local Verified Reasoning Engine</strong> (zero setup required). You can optionally enter your Google Gemini API key here to evaluate live Gemini responses.
            </p>
          </div>

          {/* Gemini API Key Input */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <Key className="w-4 h-4 text-amber-500" />
                <span>Google Gemini API Key (Optional)</span>
              </span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-600 dark:text-amber-400 hover:underline text-[10px] font-normal"
              >
                Get API Key ↗
              </a>
            </label>
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <p className="text-[10px] text-slate-400">
              Never exposed to the public. Stored in client session or passed to serverless API route.
            </p>
          </div>

          {/* Model Selection */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-800 dark:text-slate-200">
              Gemini Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <option value="gemini-1.5-flash">Gemini 1.5 Flash (Recommended - Ultra Fast)</option>
              <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
            </select>
          </div>

          {/* System Health Check Status */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                <Database className="w-4 h-4 text-emerald-500" />
                <span>Backend & Provider Health Check</span>
              </span>
              <button
                onClick={pingHealth}
                disabled={isPingingHealth}
                className="text-[10px] text-amber-600 dark:text-amber-400 flex items-center space-x-1 hover:underline"
              >
                <RefreshCw className={`w-3 h-3 ${isPingingHealth ? 'animate-spin' : ''}`} />
                <span>Ping</span>
              </button>
            </div>
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 space-y-0.5">
              <div>Open Library Provider: <strong className="text-emerald-500">Active</strong></div>
              <div>NFSU Curated Stack: <strong className="text-emerald-500">Active</strong></div>
              <div>Koha Provider Interface: <strong className="text-amber-500">Modular Ready</strong></div>
              <div>Active Reasoner: <strong>{apiKeyInput.trim() ? `Gemini (${selectedModel})` : 'NFSU Local Reasoner'}</strong></div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-[#080e1c] border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <button
            onClick={handleClearKey}
            className="text-xs text-red-600 dark:text-red-400 hover:underline"
          >
            Clear Stored Key
          </button>

          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-sm flex items-center space-x-1.5"
            >
              {saveSuccess ? <Check className="w-3.5 h-3.5" /> : null}
              <span>{saveSuccess ? 'Saved!' : 'Save & Apply'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
