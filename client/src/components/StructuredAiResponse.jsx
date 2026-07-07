import React, { useState } from 'react';
import { Copy, Check, Volume2, VolumeX, ExternalLink, AlertTriangle, ListChecks, FileText, Clock, ShieldCheck } from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech.js';

const StructuredAiResponse = ({ id, structured, language }) => {
  const [copied, setCopied] = useState(false);
  const { speak, stop, speakingId } = useSpeech();
  const isSpeaking = speakingId === id;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(structured.shortAnswer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(structured.shortAnswer, id, language);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 max-w-2xl">
      <p className="text-gray-900 text-sm leading-relaxed">{structured.shortAnswer}</p>

      <div className="flex items-center gap-2">
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 px-2 py-1 rounded-md hover:bg-gray-100"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
        <button
          onClick={handleSpeak}
          aria-pressed={isSpeaking}
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 px-2 py-1 rounded-md hover:bg-gray-100"
        >
          {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
          {isSpeaking ? 'Stop' : 'Listen'}
        </button>
      </div>

      {structured.steps?.length > 0 && (
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5">
            <ListChecks size={14} /> Step-by-step process
          </p>
          <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
            {structured.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      {structured.requiredDocuments?.length > 0 && (
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5">
            <FileText size={14} /> Required documents
          </p>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {structured.requiredDocuments.map((doc, i) => (
              <li key={i}>{doc}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        {structured.eligibility && (
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-1">Eligibility</p>
            <p className="text-gray-600">{structured.eligibility}</p>
          </div>
        )}
        {structured.estimatedTime && (
          <div>
            <p className="flex items-center gap-1 text-xs font-semibold text-gray-700 mb-1">
              <Clock size={13} /> Estimated time
            </p>
            <p className="text-gray-600">{structured.estimatedTime}</p>
          </div>
        )}
      </div>

      {structured.officialPortal?.url && (
        <a
          href={structured.officialPortal.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-brand-blue-600 hover:underline"
        >
          <ExternalLink size={14} /> {structured.officialPortal.label || 'Official portal'}
        </a>
      )}

      {structured.warnings?.length > 0 && (
        <div className="bg-brand-saffron-50 border border-brand-saffron-200 rounded-lg p-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-brand-saffron-800 mb-1">
            <AlertTriangle size={13} /> Important
          </p>
          <ul className="list-disc list-inside text-xs text-brand-saffron-800 space-y-0.5">
            {structured.warnings.map((warning, i) => (
              <li key={i}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      {structured.relatedServices?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {structured.relatedServices.map((svc, i) => (
            <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {svc}
            </span>
          ))}
        </div>
      )}

      <p className="flex items-center gap-1.5 text-[11px] text-gray-400 pt-1 border-t border-gray-100">
        <ShieldCheck size={12} /> AI guidance only — verify on the official portal before acting.
      </p>
    </div>
  );
};

export default StructuredAiResponse;
