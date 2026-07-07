import React, { useEffect, useRef, useState } from 'react';
import { Send, ShieldAlert, Loader2 } from 'lucide-react';
import { fetchChatHistory, sendChatMessage } from '../services/aiApi.js';
import { useAccessibility } from '../context/AccessibilityContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { SUGGESTED_QUESTIONS } from '../data/i18n.js';
import StructuredAiResponse from '../components/StructuredAiResponse.jsx';
import { Skeleton } from '../components/Skeleton.jsx';
import Button from '../components/Button.jsx';

const AiAssistantPage = () => {
  const { language } = useAccessibility();
  const { showToast } = useToast();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetchChatHistory()
      .then((res) => setMessages(res.data))
      .catch(() => showToast('Could not load chat history.', 'error'))
      .finally(() => setLoadingHistory(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, sending]);

  const handleSend = async (textOverride) => {
    const text = (textOverride ?? input).trim();
    if (!text || sending) return;

    setInput('');
    setMessages((prev) => [...prev, { id: `temp-${Date.now()}`, role: 'user', content: text }]);
    setSending(true);

    try {
      const res = await sendChatMessage(text, language);
      setMessages((prev) => [...prev, res.data.message]);
    } catch (err) {
      showToast(err.message || 'Failed to get a response. Please try again.', 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-3xl flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">AI Civic Assistant</h1>
        <div className="flex items-start gap-2 bg-brand-saffron-50 border border-brand-saffron-200 rounded-lg px-3 py-2 mt-2">
          <ShieldAlert size={16} className="text-brand-saffron-700 mt-0.5 shrink-0" />
          <p className="text-xs text-brand-saffron-800">
            This assistant gives general guidance only. Always verify details on the official
            government portal before acting.
          </p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-1">
        {loadingHistory ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-2/3" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="text-sm bg-white border border-gray-200 rounded-full px-3.5 py-2 hover:border-brand-blue-300 hover:bg-brand-blue-50"
              >
                {q}
              </button>
            ))}
          </div>
        ) : (
          messages.map((m) =>
            m.role === 'user' ? (
              <div key={m.id} className="flex justify-end">
                <div className="bg-brand-blue-600 text-white text-sm rounded-2xl rounded-br-sm px-4 py-2.5 max-w-[80%]">
                  {m.content}
                </div>
              </div>
            ) : (
              <StructuredAiResponse key={m.id} id={m.id} structured={m.structured} language={language} />
            )
          )
        )}
        {sending && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Loader2 size={16} className="animate-spin" /> Thinking...
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 mt-4 border border-gray-200 rounded-xl p-2 bg-white"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about any government service..."
          aria-label="Ask the AI assistant"
          className="flex-1 px-2 py-2 text-sm focus:outline-none"
        />
        <Button type="submit" disabled={!input.trim()} loading={sending} aria-label="Send message">
          <Send size={16} />
        </Button>
      </form>
    </div>
  );
};

export default AiAssistantPage;
