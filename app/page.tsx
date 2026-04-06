"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Upload, User, Bot, Loader2, RefreshCw, X, Shield, Terminal, Zap, Activity, Info } from "lucide-react";
import { ArtifactRenderer } from "@/components/ArtifactRenderer";
import { FeedbackSystem } from "@/components/FeedbackSystem";
import { PRODUCT_SPECS } from "@/lib/knowledge";

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [artifact, setArtifact] = useState<{ type: any; metadata: any }>({ type: null, metadata: null });
  const scrollRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleRefinement = (refinedInput: string) => {
    const userMsg = { role: "user", content: refinedInput };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    processMessage(refinedInput, [...messages, userMsg]);
  };

  const processMessage = async (content: string, history: any[]) => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      const data = await res.json();
      if (data.content) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
        
        // --- VISUAL PARSING ---
        const visualMatch = data.content.match(/```visual\n([\s\S]*?)\n```/);
        if (visualMatch) {
            try {
                const visualData = JSON.parse(visualMatch[1]);
                setArtifact(visualData);
            } catch (e) {
                console.error("Failed to parse visual block:", e);
            }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    processMessage(input, [...messages, userMsg]);
  };

  return (
    <main className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden hud-grid">
      <div className="scanline" />
      
      {/* Sidebar: Navigation & Identity */}
      <div className="w-16 border-r border-white/5 flex flex-col items-center py-8 gap-8 backdrop-blur-xl bg-black/40">
         <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center font-bold italic shadow-[0_0_20px_#FF5F1F] group cursor-pointer hover:scale-110 transition-transform">V</div>
         <div className="h-px w-8 bg-zinc-800" />
         {[Zap, Shield, Terminal, Activity].map((Icon, i) => (
           <div key={i} className="text-zinc-600 hover:text-orange-500 cursor-pointer transition-colors p-2">
             <Icon size={20} />
           </div>
         ))}
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-row overflow-hidden relative">
        
        {/* Chat Section */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="px-8 py-6 flex justify-between items-center bg-black/20 backdrop-blur-sm border-b border-white/5">
            <div>
              <h1 className="text-xl font-black tracking-tighter uppercase italic flex items-center gap-2">
                Vulcan <span className="text-orange-600 not-italic tracking-normal lowercase opacity-70">O220_SYSTEM</span>
              </h1>
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">MultiProcess Reasoning // Mode: Expert</p>
            </div>
            <div className="flex items-center gap-4 bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-800">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
               <span className="text-[10px] font-mono text-emerald-500 font-bold uppercase">Ready</span>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-8 space-y-12 scroll-smooth scrollbar-none" ref={scrollRef}>
            <AnimatePresence mode="popLayout">
              {messages.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full flex flex-col items-center justify-center max-w-lg mx-auto text-center"
                >
                  <div className="w-20 h-20 bg-orange-500/10 rounded-3xl border border-orange-500/20 flex items-center justify-center mb-6 shadow-inner ring-1 ring-orange-500/5 transition-transform hover:rotate-3">
                    <Info size={40} className="text-orange-500" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight mb-2">Technical Guidance Initialized</h2>
                  <p className="text-zinc-500 text-sm mb-10 font-mono uppercase tracking-[0.1em]">Direct access to Vulcan 220 Engineering knowledge</p>
                  
                  <div className="grid grid-cols-2 gap-4 w-full">
                     {[
                       { p: "Duty cycle for 240V MIG at 200A?", icon: <Zap size={14} /> },
                       { p: "Polarity setup for flux-cored welding?", icon: <Terminal size={14} /> }
                     ].map((item, i) => (
                       <button 
                         key={i} 
                         onClick={() => { setInput(item.p); }}
                         className="p-5 bg-zinc-950 border border-zinc-800 rounded-2xl text-[11px] font-bold uppercase transition-all hover:border-orange-500 hover:bg-orange-500/5 flex items-center justify-between group shadow-lg"
                       >
                         <span className="text-left w-3/4">{item.p}</span>
                         <span className="text-zinc-600 group-hover:text-orange-500 transition-colors">{item.icon}</span>
                       </button>
                     ))}
                  </div>
                </motion.div>
              )}
              
              {messages.map((m, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: m.role === "user" ? 20 : -20, y: 10 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`flex gap-6 ${m.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/10 ${m.role === "user" ? "bg-zinc-800" : "bg-orange-600 shadow-[0_0_15px_#FF5F1F]"}`}>
                    {m.role === "user" ? <User size={18} /> : <Zap size={18} />}
                  </div>
                  <div className={`max-w-[75%] space-y-4`}>
                    <div className={`p-6 rounded-[2rem] text-sm leading-relaxed tracking-tight ${m.role === "user" ? "bg-zinc-900 border border-zinc-800 rounded-tr-none text-zinc-300" : "bg-zinc-950/80 border border-zinc-800 rounded-tl-none font-medium shadow-2xl"}`}>
                      {m.content.split('\n').map((line, lid) => (
                        <p key={lid} className={lid > 0 ? "mt-3" : ""}>{line}</p>
                      ))}
                      
                      {m.role === "assistant" && i === messages.length - 1 && !isLoading && (
                         <FeedbackSystem 
                           onRefine={(correction) => {
                             const refinedInput = `REFINEMENT: ${correction}`;
                             handleRefinement(refinedInput);
                           }} 
                         />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-6"
                >
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                    <Zap size={18} className="text-orange-600 animate-pulse" />
                  </div>
                  <div className="bg-zinc-950/50 p-6 rounded-[2rem] rounded-tl-none border border-zinc-800">
                     <div className="flex gap-1.5 h-4 items-center">
                        {[0, 1, 2].map((d) => (
                          <motion.div 
                            key={d}
                            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                            transition={{ repeat: Infinity, duration: 1, delay: d * 0.2 }}
                            className="w-1.5 h-1.5 bg-orange-500 rounded-full"
                          />
                        ))}
                     </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-8 pb-10 bg-black/40 backdrop-blur-xl border-t border-white/5 relative">
            <div className="max-w-4xl mx-auto flex gap-4">
              <div className="flex-1 relative group">
                <div className="absolute inset-x-0 -bottom-1 h-3 bg-orange-600/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="Query system for specs or diagnosis..."
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600/50 transition-all font-mono placeholder:text-zinc-700"
                />
              </div>
              <button 
                onClick={() => { setInput("Analyze porosity in my 120V MIG setup."); }}
                className="w-14 h-14 flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-2xl hover:text-emerald-500 hover:border-emerald-500/50 transition-all shadow-lg"
                title="Mock Process Diagnosis"
              >
                <Activity size={20} />
              </button>
              <button 
                onClick={() => handleSubmit()}
                disabled={isLoading || !input.trim()}
                className="w-14 h-14 flex items-center justify-center bg-orange-600 text-black rounded-2xl hover:bg-orange-500 disabled:opacity-50 disabled:grayscale transition-all shadow-[0_0_20px_rgba(255,95,31,0.3)]"
              >
                {isLoading ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
              </button>
            </div>
            <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[9px] font-mono text-zinc-700 uppercase tracking-[0.3em] font-bold">Encrypted Link // Claude 3.5 Sonnet</p>
          </div>
        </div>

        {/* Right Section: Artifact Hud */}
        <motion.div 
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-[500px] border-l border-white/5 bg-black/60 relative z-20 flex flex-col"
        >
           {/* Visual Artifact UI */}
           <ArtifactRenderer type={artifact.type} metadata={artifact.metadata} />
           
           {/* Decorative HUD Elements */}
           <div className="absolute top-4 right-4 text-zinc-800 font-mono text-[8px] pointer-events-none select-none uppercase tracking-[0.4em] origin-top-right rotate-90 translate-y-12">
             Sensor_Data_Stream_v4.0
           </div>
        </motion.div>

      </div>
    </main>
  );
}
