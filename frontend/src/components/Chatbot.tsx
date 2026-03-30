import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../AppContext';
import { Bot, Send, Loader2, ImageIcon, Mic, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { getTravelAdvice } from '../services/geminiService';

interface Message { role: 'bot' | 'user'; text: string; }

export const Chatbot = () => {
  const { setShowChatbot } = useApp();
  const storedUser = JSON.parse(localStorage.getItem('pravas_user') || '{}');
  const firstName = storedUser?.name?.split(' ')[0] || 'Traveller';
  const city = localStorage.getItem('pravas_current_city') || 'your destination';

  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: `Hello ${firstName}! I'm your प्रvaas AI concierge powered by Ollama. Ask me anything about ${city} or your trip!` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setIsLoading(true);
    try {
      const response = await getTravelAdvice(text);
      setMessages(prev => [...prev, { role: 'bot', text: response || "I couldn't process that. Please try again." }]);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: 'Ollama is not responding. Make sure it is running with: set OLLAMA_ORIGINS=* && ollama serve' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4 sm:p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowChatbot(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />

      <motion.div initial={{ opacity: 0, y: 100, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 100, scale: 0.95 }} className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col h-[80vh] max-h-[800px]">

        <header className="px-8 py-6 border-b border-outline-variant/10 flex items-center justify-between bg-white/80 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-headline text-xl font-bold text-primary">AI Concierge</h1>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Ollama · phi3</span>
              </div>
            </div>
          </div>
          <button onClick={() => setShowChatbot(false)} className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary hover:bg-surface-container transition-colors">
            <X className="w-5 h-5" />
          </button>
        </header>

        <main ref={scrollRef} className="flex-grow p-8 overflow-y-auto space-y-6 bg-surface-container-lowest/30">
          {messages.map((msg, i) => (
            <div key={i} className={cn("flex w-full", msg.role === 'user' ? "justify-end" : "justify-start")}>
              <div className={cn("max-w-[85%] p-6 rounded-[2.5rem] shadow-sm", msg.role === 'user' ? "bg-primary text-white rounded-tr-none" : "bg-white text-on-surface border border-outline-variant/10 rounded-tl-none")}>
                <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-6 rounded-[2.5rem] rounded-tl-none border border-outline-variant/10 shadow-sm flex items-center gap-3">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Thinking…</span>
              </div>
            </div>
          )}
        </main>

        <div className="p-8 bg-white border-t border-outline-variant/10">
          <div className="flex items-center gap-3 bg-surface-container-low p-3 rounded-[2.5rem] border border-outline-variant/10">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Ask anything about your trip…"
              className="flex-grow bg-transparent border-none font-medium text-sm focus:ring-0 px-4"
            />
            <button onClick={handleSend} disabled={!input.trim() || isLoading} className="w-14 h-14 rounded-[1.5rem] primary-gradient text-white flex items-center justify-center shadow-lg disabled:opacity-50 transition-all active:scale-95">
              <Send className="w-6 h-6" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};