"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageSquarePlus, CornerDownRight, Sparkles } from "lucide-react";
import { useState } from "react";

interface FeedbackProps {
  onRefine: (correction: string) => void;
}

export function FeedbackSystem({ onRefine }: FeedbackProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <div className="relative mt-4">
      <AnimatePresence>
        {!isOpen ? (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-orange-500/20 bg-orange-500/5 text-orange-500 hover:bg-orange-500/10 transition-all font-mono text-[10px] uppercase tracking-widest font-bold"
          >
            <Sparkles size={12} />
            Refine Parameters
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl flex items-center gap-2 group w-full"
          >
            <div className="pl-3 text-zinc-600">
              <CornerDownRight size={14} />
            </div>
            <input 
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Correct the agent or provide more detail..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-xs text-zinc-300 placeholder:text-zinc-700 py-2"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && value) {
                  onRefine(value);
                  setIsOpen(false);
                  setValue("");
                }
                if (e.key === 'Escape') setIsOpen(false);
              }}
            />
            <button 
              onClick={() => {
                if (value) {
                  onRefine(value);
                  setIsOpen(false);
                  setValue("");
                }
              }}
              className="bg-orange-600 text-black px-4 py-2 rounded-lg text-[10px] font-bold uppercase hover:bg-orange-500 transition-colors shrink-0"
            >
              Analyze
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
