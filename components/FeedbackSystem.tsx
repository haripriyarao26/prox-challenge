"use client";

import { RefreshCw, MessageSquarePlus } from "lucide-react";

interface FeedbackProps {
  onRefine: (correction: string) => void;
}

export function FeedbackSystem({ onRefine }: FeedbackProps) {
  return (
    <div className="mt-4 p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl animate-in fade-in slide-in-from-bottom duration-300">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquarePlus size={16} className="text-orange-400" />
        <h4 className="text-xs font-bold uppercase text-orange-400">Refine Agent Reasoning</h4>
      </div>
      <p className="text-[11px] text-zinc-400 mb-4">
        If the agent's logic doesn't match the manual, provide a correction to help it learn the context for this session.
      </p>
      <div className="flex gap-2">
        <input 
          id="feedback-input"
          placeholder="e.g. 'Actually, polarity should be DCEN for this...'"
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-orange-500"
        />
        <button 
          onClick={() => {
            const val = (document.getElementById("feedback-input") as HTMLInputElement).value;
            if (val) onRefine(val);
          }}
          className="bg-orange-500 text-black px-3 py-2 rounded-lg text-xs font-bold hover:bg-orange-400 transition-colors flex items-center gap-2"
        >
          <RefreshCw size={12} /> Refine
        </button>
      </div>
    </div>
  );
}
