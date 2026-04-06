"use client";

import { AlertCircle, Zap, Box, Activity } from "lucide-react";

interface ArtifactProps {
  type: "POLARITY" | "DUTY_CYCLE" | "DIAGNOSIS" | "WIRING" | null;
  metadata?: any;
}

export function ArtifactRenderer({ type, metadata }: ArtifactProps) {
  if (!type) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-500">
        <Box size={48} className="mb-4 opacity-20" />
        <p>No visual artifact rendered yet.</p>
        <p className="text-sm">Ask about polarity, duty cycles, or setup.</p>
      </div>
    );
  }

  return (
    <div className="p-6 h-full animate-in fade-in slide-in-from-right duration-500">
      <div className="flex items-center gap-2 mb-6">
        <Zap className="text-yellow-400" size={24} />
        <h2 className="text-xl font-bold uppercase tracking-tight">
          System Artifact: {type.replace("_", " ")}
        </h2>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 min-h-[400px]">
        {type === "POLARITY" && (
          <div className="space-y-6">
            <p className="text-zinc-400">Current Process: <span className="text-white font-mono font-bold uppercase">{metadata?.process || "MIG"}</span></p>
            <div className="flex justify-center gap-12 py-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full border-4 border-red-500 flex items-center justify-center mb-2 font-bold shadow-lg shadow-red-500/20">+</div >
                <p className="text-xs text-zinc-500 uppercase">Positive</p>
                <p className="text-sm font-bold text-red-400 mt-1">{metadata?.positive || "Torch"}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full border-4 border-blue-500 flex items-center justify-center mb-2 font-bold shadow-lg shadow-blue-500/20">-</div >
                <p className="text-xs text-zinc-500 uppercase">Negative</p>
                <p className="text-sm font-bold text-blue-400 mt-1">{metadata?.negative || "Ground"}</p>
              </div>
            </div>
            <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700/50">
              <div className="flex gap-3">
                <AlertCircle size={18} className="text-blue-400 shrink-0" />
                <p className="text-sm text-zinc-300">
                  <span className="font-bold text-white">Technician Note:</span> Ensure the DINSE connector is rotated clockwise until hand-tight to prevent arcing.
                </p>
              </div>
            </div>
          </div>
        )}

        {type === "DUTY_CYCLE" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Duty Cycle Matrix</h3>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-zinc-800 rounded text-xs">120V</span>
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs border border-yellow-500/30 font-bold">240V</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "MIG", val: 200, pct: 25 },
                { label: "TIG", val: 175, pct: 30 },
                { label: "STK", val: 175, pct: 25 },
              ].map((item) => (
                <div key={item.label} className="bg-zinc-800/30 p-4 rounded-lg border border-zinc-700/30">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs text-zinc-500 font-bold">{item.label}</span>
                    <span className="text-lg font-mono font-bold text-yellow-400">{item.pct}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-yellow-500 h-full transition-all duration-1000" 
                      style={{ width: `${item.pct}%` }} 
                    />
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-2 text-right">MAX: {item.val}A @ 240V</p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-yellow-500/5 rounded-lg border border-yellow-500/10">
              <p className="text-xs text-yellow-500/70 leading-relaxed italic">
                Notice: Duty cycle is based on a 10-minute period. At 200A MIG (240V), the machine can weld for 2.5 minutes followed by 7.5 minutes of cool-down.
              </p>
            </div>
          </div>
        )}

        {type === "DIAGNOSIS" && (
           <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Activity size={18} className="text-emerald-400" />
                <h3 className="text-lg font-bold">Weld Diagnosis: Porosity</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="aspect-video bg-zinc-800 rounded border border-zinc-700 overflow-hidden relative">
                   <div className="absolute inset-0 flex items-center justify-center text-xs text-zinc-600 uppercase font-bold">Visual Reference [Ref: Manual p.32]</div>
                </div>
                <div className="grid grid-rows-2 gap-2">
                   <div className="bg-zinc-800 rounded border border-zinc-700/50 p-3 text-[10px] text-zinc-400 uppercase font-bold">Root Cause: Gas Leak</div>
                   <div className="bg-zinc-800 rounded border border-zinc-700/50 p-3 text-[10px] text-zinc-400 uppercase font-bold">Root Cause: Dirty Metal</div>
                </div>
              </div>

              <ul className="space-y-3">
                 {["Verify Gas Flow Rate (20-30 CFH)", "Clean material with wire brush", "Check ground clamp contact"].map((step, i) => (
                   <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                     <span className="w-5 h-5 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-[10px] font-bold">{i+1}</span>
                     {step}
                   </li>
                 ))}
              </ul>
           </div>
        )}
      </div>
    </div>
  );
}
