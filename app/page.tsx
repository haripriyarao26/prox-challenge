"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Upload, User, Bot, Loader2, RefreshCw, X } from "lucide-react";
import { ArtifactRenderer } from "@/components/ArtifactRenderer";
import { FeedbackSystem } from "@/components/FeedbackSystem";
import { PRODUCT_SPECS } from "@/lib/knowledge";

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [artifact, setArtifact] = useState<{ type: any; metadata: any }>({ type: null, metadata: null });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
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

  return (
    <main className="flex h-screen bg-black text-white font-sans overflow-hidden">
      <div className="flex-1 flex flex-col border-r border-zinc-800">
        <header className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/40 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center font-bold italic shadow-[0_0_15px_rgba(249,115,22,0.4)]">V</div>
            <h1 className="font-bold tracking-tight text-lg uppercase italic">Vulcan <span className="text-zinc-500 not-italic lowercase">OmniPro 220 Expert</span></h1>
          </div>
          <div className="flex gap-4">
             <div className="px-2 py-1 bg-zinc-800 rounded text-[10px] font-mono text-zinc-500 border border-zinc-700/50 uppercase">SDK Mode v0.1</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth" ref={scrollRef}>
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 max-w-sm mx-auto text-center">
              <Bot size={48} className="mb-4 opacity-20" />
              <p className="text-lg font-bold text-zinc-300">Start the diagnosis</p>
              <p className="text-sm">Ask about duty cycles, polarity setups, or troubleshooting welds with photos.</p>
              <div className="grid grid-cols-2 gap-2 mt-8 w-full">
                 <button onClick={() => setInput("What's the duty cycle for MIG at 200A on 240V?")} className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-xs hover:border-zinc-500 transition-colors">"What's the duty cycle?"</button>
                 <button onClick={() => setInput("How do I setup polarity for Flux-Cored?")} className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-xs hover:border-zinc-500 transition-colors">"Flux-Cored Setup"</button>
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === "user" ? "bg-zinc-700" : "bg-orange-500"}`}>
                {m.role === "user" ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${m.role === "user" ? "bg-zinc-800 rounded-tr-none" : "bg-zinc-900 border border-zinc-800 rounded-tl-none"}`}>
                {m.content}
                {m.role === "assistant" && i === messages.length - 1 && !isLoading && (
                   <FeedbackSystem 
                     onRefine={(correction) => {
                       const nextMsg = `REFINEMENT: The user is providing a correction. My previous logic was flawed. Correction: "${correction}". Use this context going forward and update the visual if needed.`;
                       setInput(nextMsg);
                       // We can't easily call handleSubmit electronically but we can trigger it
                       document.getElementById("chat-form")?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
                     }} 
                   />
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center shrink-0 animate-pulse">
                <Bot size={16} />
              </div>
              <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl rounded-tl-none">
                 <Loader2 className="animate-spin text-zinc-500" size={16} />
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-zinc-800 bg-zinc-900/40">
          <form id="chat-form" onSubmit={handleSubmit} className="flex gap-3 relative">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your technical question..."
              className="flex-1 bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
            />
            <button 
              type="button" 
              onClick={() => {
                setInput("I've noticed porosity in my welds (as seen in this photo). Diagnosing the issue and recommending setup changes.");
              }}
              className="px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl hover:text-emerald-400 transition-colors"
              title="Mock Photo Upload"
            >
              <Upload size={18} />
            </button>
            <button 
              type="submit" 
              className="px-4 py-3 bg-orange-500 text-black font-bold rounded-xl hover:bg-orange-400 disabled:opacity-50 disabled:hover:bg-orange-500 transition-all flex items-center gap-2"
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
            </button>
          </form>
          <p className="text-[10px] text-zinc-600 mt-3 text-center uppercase tracking-widest">Powered by Claude 3.5 Sonnet + Agent SDK</p>
        </div>
      </div>

      <div className="w-[450px] bg-zinc-950 flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-10">
         <ArtifactRenderer type={artifact.type} metadata={artifact.metadata} />
      </div>
    </main>
  );
}
