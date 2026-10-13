import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Trash2, 
  Globe, 
  Mic, 
  MicOff, 
  Search, 
  Library, 
  ExternalLink,
  Bot,
  User,
  Info,
  Maximize2,
  Minimize2,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { ChatMessage, Language, BookRecord } from '../../types';
import { translations } from '../../i18n/translations';
import { geminiService } from '../../services/ai/geminiService';
import { catalogueService } from '../../services/catalogue';
import { BookCard } from '../catalogue/BookCard';
import { globalRateLimiter } from '../../services/security/rateLimiter';
import { SecuritySanitizer } from '../../services/security/sanitizer';

interface FloatingChatbotProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isOpen: boolean;
  onToggle: () => void;
  initialTopic?: string;
}

export const FloatingChatbot: React.FC<FloatingChatbotProps> = ({
  language,
  onLanguageChange,
  isOpen,
  onToggle,
  initialTopic
}) => {
  const t = translations[language];

  // Conversation State
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg-welcome',
        role: 'assistant',
        content: `${t.chatWelcomeTitle}\n\n${t.chatWelcomeSubtitle}\n\n💡 *Ask me about books, research papers, Boolean search strings, or how to access ONOS & INFED off-campus.*`,
        timestamp: Date.now(),
        suggestedFollowUps: t.suggestedQuestions.slice(0, 3)
      }
    ];
  });

  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchHistoryFilter, setSearchHistoryFilter] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  // Handle external initial topic injection
  useEffect(() => {
    if (initialTopic && isOpen) {
      setInputValue(`Find books about ${initialTopic}`);
    }
  }, [initialTopic, isOpen]);

  // Keyboard shortcut listener (Ctrl + Space / Cmd + Space)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.code === 'Space') {
        e.preventDefault();
        onToggle();
      }
      if (e.key === 'Escape' && isOpen) {
        onToggle();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onToggle]);

  // Web Speech API Voice Input
  const toggleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please use keyboard input.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : language === 'gu' ? 'gu-IN' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const speechToText = event.results[0][0].transcript;
      setInputValue(speechToText);
      setIsListening(false);
    };

    recognition.start();
  };

  // Submit User Message
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isProcessing) return;

    // Rate Limiter Check
    const rateCheck = globalRateLimiter.check();
    if (!rateCheck.isAllowed) {
      setRateLimitError(`Rate limit reached. Please wait ${rateCheck.retryAfterSeconds}s before asking again.`);
      setTimeout(() => setRateLimitError(null), 5000);
      return;
    }

    const sanitized = SecuritySanitizer.sanitizeQuery(text);
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: sanitized,
      timestamp: Date.now(),
      language
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsProcessing(true);

    try {
      // Step 1: Process Query through Gemini / Local Reasoning Engine
      const aiResult = await geminiService.processMessage(sanitized, messages, language);

      let fetchedBooks: BookRecord[] = [];
      // Step 2: If intent indicates catalogue search, perform real search with extracted filters
      if (aiResult.extraction.intent === 'catalogue_search' && aiResult.extraction.searchFilters) {
        const filters = aiResult.extraction.searchFilters;
        const catalogueResponse = await catalogueService.search(filters, 'openlibrary');
        fetchedBooks = catalogueResponse.books;
      }

      // Step 3: Append Assistant Response
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: aiResult.assistantResponse,
        timestamp: Date.now(),
        language,
        intent: aiResult.extraction.intent,
        extractedFilters: aiResult.extraction.searchFilters,
        books: fetchedBooks.length > 0 ? fetchedBooks : undefined,
        suggestedFollowUps: aiResult.suggestedFollowUps,
        relatedKeywords: aiResult.relatedKeywords,
        kohaCheckUrl: aiResult.kohaCheckUrl
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: `I encountered an unexpected issue while retrieving catalogue data. Please try asking again or check the official [NFSU KOHA OPAC](https://catalog.nfsu.ac.in).`,
        timestamp: Date.now(),
        suggestedFollowUps: t.suggestedQuestions.slice(0, 2)
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearHistory = () => {
    if (confirm("Clear conversation history?")) {
      setMessages([
        {
          id: 'msg-welcome-fresh',
          role: 'assistant',
          content: `${t.chatWelcomeTitle}\n\nConversation cleared. How can I assist your research today?`,
          timestamp: Date.now(),
          suggestedFollowUps: t.suggestedQuestions.slice(0, 3)
        }
      ]);
      setSearchHistoryFilter('');
    }
  };

  const filteredMessages = searchHistoryFilter.trim()
    ? messages.filter(m => m.content.toLowerCase().includes(searchHistoryFilter.toLowerCase()))
    : messages;

  return (
    <>
      {/* Floating Action Button Trigger */}
      {!isOpen && (
        <button
          onClick={onToggle}
          title="Open NFSU AI Library Assistant (Ctrl + Space)"
          aria-label={t.openChat}
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-slate-950 font-bold shadow-2xl shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white/40 flex items-center space-x-2.5 group"
        >
          <div className="relative">
            <Sparkles className="w-6 h-6 text-slate-950 animate-pulse-slow" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
          </div>
          <span className="hidden sm:inline text-xs uppercase tracking-wider font-extrabold pr-1">
            Research AI
          </span>
          <span className="hidden md:inline text-[10px] bg-slate-950/20 px-1.5 py-0.5 rounded font-mono">
            Ctrl+Space
          </span>
        </button>
      )}

      {/* Main Chat Interface Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="NFSU AI Research Assistant"
          className={`fixed z-50 transition-all duration-300 flex flex-col shadow-2xl ${
            isExpanded
              ? 'inset-2 sm:inset-6 rounded-2xl'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[95vw] sm:w-[480px] h-[85vh] sm:h-[680px] max-h-[90vh] rounded-2xl'
          } bg-white dark:bg-[#0c1527] border border-slate-300/80 dark:border-slate-800 backdrop-blur-xl overflow-hidden`}
        >
          {/* Top Chat Header */}
          <div className="bg-gradient-to-r from-[#0b1f3a] via-[#112a4f] to-[#071324] px-4 py-3.5 text-white flex items-center justify-between border-b border-amber-500/30">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 shadow-sm">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold font-display text-white">
                    NFSU Research Assistant
                  </h3>
                  <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded font-mono">
                    AI Active
                  </span>
                </div>
                <p className="text-[10px] text-slate-300">
                  Open Library Search & Verified Academic Guide
                </p>
              </div>
            </div>

            {/* Header Action Tools */}
            <div className="flex items-center space-x-1">
              {/* Language Selector in Chat */}
              <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                aria-label="Chat language selection"
                className="bg-white/10 text-white text-[10px] rounded px-1.5 py-1 border border-white/20 focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
              >
                <option value="en" className="text-slate-900">EN</option>
                <option value="hi" className="text-slate-900">हिन्दी</option>
                <option value="gu" className="text-slate-900">ગુજરાતી</option>
              </select>

              {/* Clear History */}
              <button
                onClick={handleClearHistory}
                title={t.clearHistory}
                className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              {/* Expand / Minimize Window */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Minimize Window" : "Maximize Window"}
                className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-white/10 transition-colors hidden sm:block"
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>

              {/* Close Button */}
              <button
                onClick={onToggle}
                title={t.closeChat}
                className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search Conversation Bar (Filter Past Messages) */}
          <div className="px-3 py-1.5 bg-slate-50 dark:bg-[#080e1c] border-b border-slate-200 dark:border-slate-800/80 flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchHistoryFilter}
              onChange={(e) => setSearchHistoryFilter(e.target.value)}
              placeholder={t.searchHistory}
              className="w-full text-xs bg-transparent border-none focus:outline-none text-slate-700 dark:text-slate-300 placeholder-slate-400"
            />
            {searchHistoryFilter && (
              <button onClick={() => setSearchHistoryFilter('')} className="text-slate-400 hover:text-slate-600">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Rate Limit Alert */}
          {rateLimitError && (
            <div className="bg-red-500/10 border-b border-red-500/30 px-3 py-1.5 text-xs text-red-600 dark:text-red-400 flex items-center space-x-1.5">
              <Info className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{rateLimitError}</span>
            </div>
          )}

          {/* Messages Scroll View */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {filteredMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {/* Assistant Avatar */}
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 border border-amber-500/30 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                {/* Message Body */}
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-amber-500 text-slate-950 rounded-tr-none font-medium'
                      : 'bg-slate-100 dark:bg-[#132039] text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {/* Markdown / Text content */}
                  <div className="whitespace-pre-wrap leading-relaxed text-xs break-words">
                    {msg.content}
                  </div>

                  {/* Embedded Koha Verification Link if flagged */}
                  {msg.kohaCheckUrl && (
                    <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700/60">
                      <a
                        href={msg.kohaCheckUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/40 hover:bg-amber-500/30 transition-colors"
                      >
                        <Library className="w-3.5 h-3.5" />
                        <span>Search NFSU KOHA OPAC Directly</span>
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </a>
                    </div>
                  )}

                  {/* Embedded Book Cards */}
                  {msg.books && msg.books.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700/60 space-y-2.5">
                      <div className="font-bold text-[11px] text-amber-600 dark:text-amber-400 flex items-center space-x-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Matching Bibliographic Records ({msg.books.length}):</span>
                      </div>
                      <div className="space-y-3">
                        {msg.books.slice(0, 3).map((book) => (
                          <BookCard
                            key={book.id}
                            book={book}
                            language={language}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Follow-up suggestions chips */}
                  {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700/50">
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-1.5 font-medium">
                        Suggested Follow-ups:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {msg.suggestedFollowUps.map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(suggestion)}
                            className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 border border-slate-200 dark:border-slate-700 text-[10px] font-medium text-left transition-colors"
                          >
                            + {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Timestamp */}
                  <div className="text-[9px] text-slate-400 text-right">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {/* User Avatar */}
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* AI Processing Shimmer */}
            {isProcessing && (
              <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 py-2">
                <Bot className="w-4 h-4 animate-spin text-amber-500" />
                <span className="shimmer-text font-medium">{t.aiThinking}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Suggestion Chips for Fast Interaction */}
          <div className="px-3 py-1.5 bg-slate-50 dark:bg-[#091122] border-t border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none flex gap-1.5">
            {t.suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 border border-slate-200 dark:border-slate-700 whitespace-nowrap transition-colors flex-shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Input Field */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="p-3 bg-white dark:bg-[#0c1527] border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2"
          >
            {/* Voice Input Button */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              title={isListening ? t.stopListening : t.voiceInput}
              className={`p-2 rounded-xl border transition-colors ${
                isListening
                  ? 'bg-red-500 text-white border-red-600 animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:text-amber-600'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Text Input */}
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isListening ? t.listening : t.inputPlaceholder}
              disabled={isProcessing}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputValue.trim() || isProcessing}
              title={t.send}
              className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20 disabled:opacity-40 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Privacy Disclaimer Footer Note */}
          <div className="px-3 py-1 bg-slate-100 dark:bg-[#070d18] text-[9px] text-slate-400 text-center border-t border-slate-200 dark:border-slate-800/60">
            🔒 Privacy First: Short-lived session only. Physical shelf holdings must be verified in Koha OPAC.
          </div>
        </div>
      )}
    </>
  );
};
