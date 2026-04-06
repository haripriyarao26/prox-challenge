"use client";

import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { AlertCircle, Zap, Box, Activity, Terminal } from "lucide-react";
import { useState } from "react";

interface ArtifactProps {
  type: "POLARITY" | "DUTY_CYCLE" | "DIAGNOSIS" | "WIRING" | null;
  metadata?: any;
}

export function ArtifactRenderer({ type, metadata }: ArtifactProps) {
  const x = useMotionValue(200);
  const y = useMotionValue(200);

  const rotateX = useTransform(y, [0, 400], [10, -10]);
  const rotateY = useTransform(x, [0, 400], [-10, 10]);

  function handleMouse(event: any) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  }

  if (!type) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-500 opacity-40">
        <Terminal size={48} className="mb-4 animate-pulse text-orange-500" />
        <p className="font-mono text-[10px] tracking-widest uppercase">Awaiting System Input...</p>
      </div>
    );
  }

  return (
    <div 
      className="p-4 h-full flex flex-col perspective-1000"
      onMouseMove={handleMouse}
    >
      <div className="flex items-center justify-between mb-8 px-4">
         <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-orange-500 shadow-[0_0_10px_#FF5F1F]" />
            <h2 className="text-xl font-bold uppercase tracking-tighter italic">
              Module: <span className="text-orange-500">{type.replace("_", " ")}</span>
            </h2>
         </div>
         <div className="text-[10px] font-mono text-zinc-600 bg-zinc-950 border border-zinc-800 px-2 py-1 rounded">
           SYS_REF: VULCAN_O220_v0
         </div>
      </div>

      <motion.div 
        style={{ rotateX, rotateY }}
        className="flex-1 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 relative overflow-hidden group shadow-2xl backdrop-blur-3xl transform-gpu transition-transform duration-200 ease-out"
      >
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />
        
        {/* Artifact Content */}
        <div className="relative z-10 h-full">
          {type === "POLARITY" && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/50">
                 <p className="text-[10px] font-mono text-zinc-500 uppercase">Process Parameter</p>
                 <p className="text-sm font-bold text-white uppercase tracking-widest">{metadata?.process || "MIG"}</p>
              </div>
              
              <div className="flex justify-around items-center py-12 gap-4">
                {[
                  { tag: "+", color: "orange", label: metadata?.positive || "Torch", pos: "LEFT" },
                  { tag: "-", color: "blue", label: metadata?.negative || "Ground", pos: "RIGHT" }
                ].map((s) => (
                  <div key={s.tag} className="text-center group/socket">
                    <div className={`w-24 h-24 rounded-2xl border-2 border-${s.color}-500/30 bg-${s.color}-500/5 flex items-center justify-center mb-4 transition-all duration-500 group-hover/socket:border-${s.color}-500 group-hover/socket:shadow-[0_0_25px_rgba(255,95,31,0.2)]`}>
                       <span className={`text-4xl font-bold text-${s.color}-500 font-mono`}>{s.tag}</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">{s.tag === "+" ? "Positive Terminal" : "Negative Terminal"}</p>
                    <p className="text-sm font-mono text-white bg-zinc-950 px-3 py-1 rounded border border-zinc-800">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="glass-accent p-4 rounded-xl border border-orange-500/20 shadow-inner">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded bg-orange-500/20 flex items-center justify-center shrink-0">
                    <AlertCircle size={18} className="text-orange-500" />
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    <span className="font-bold text-white uppercase tracking-tighter text-[10px] block mb-1">Expert Alert:</span>
                    Strictly follow socket alignment. Misconfiguration can cause severe slag entrapment or incomplete fusion. Rotate the plug <span className="text-white font-bold">180 degrees</span> to lock.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {type === "DUTY_CYCLE" && (
            <motion.div 
               initial={{ opacity: 0, x: 20 }} 
               animate={{ opacity: 1, x: 0 }}
               className="space-y-10"
            >
              <div className="space-y-2">
                 <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-[0.2em]">Thermal Tolerance Matrix</h3>
                 <div className="h-[1px] w-full bg-gradient-to-r from-orange-500/50 to-transparent" />
              </div>

              <div className="grid gap-6">
                {[
                  { label: "MIG (Gas-Shielded)", amps: 200, pct: 25, voltage: "240V" },
                  { label: "TIG (Argon)", amps: 175, pct: 30, voltage: "240V" },
                  { label: "Stick (SMAW)", amps: 175, pct: 25, voltage: "240V" },
                ].map((item, i) => (
                  <motion.div 
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <p className="text-xs font-bold text-white tracking-tight">{item.label}</p>
                        <p className="text-[10px] text-zinc-500 font-mono italic">{item.voltage} Input</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-bold font-mono text-orange-500">{item.pct}%</span>
                        <p className="text-[10px] text-zinc-500 font-mono">@ {item.amps}A</p>
                      </div>
                    </div>
                    <div className="relative h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800 shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.pct}%` }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="absolute h-full bg-gradient-to-r from-orange-600 to-orange-400 shadow-[0_0_10px_#FF5F1F]"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="bg-zinc-950/80 p-5 rounded-2xl border border-zinc-800 flex gap-4 items-center shimmer">
                <Box size={24} className="text-zinc-500 shrink-0" />
                <p className="text-[11px] text-zinc-400 font-mono leading-tight">
                  <span className="text-orange-500 font-bold">CALCULATION LOADED:</span> Duty cycle based on 10 min window. Cool down must occur while machine remains <span className="text-white">ON</span> for fan cooling.
                </p>
              </div>
            </motion.div>
          )}

          {type === "DIAGNOSIS" && (
             <motion.div 
               initial={{ filter: "blur(20px)", opacity: 0 }}
               animate={{ filter: "blur(0px)", opacity: 1 }}
               className="space-y-6"
             >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Activity size={20} className="text-emerald-500 animate-pulse" />
                    <h3 className="text-lg font-bold tracking-tighter uppercase italic">Weld Analysis Report</h3>
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[10px] font-mono font-bold border border-emerald-500/30">ISSUE_FOUND</span>
                </div>

                <div className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-800 bg-black group-hover:border-emerald-500/30 transition-colors shadow-2xl">
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 z-10" />
                   <div className="absolute inset-0 flex items-center justify-center text-zinc-800">
                      <Box size={64} className="animate-spin duration-[10s]" />
                   </div>
                   <div className="absolute bottom-4 left-4 z-20 flex gap-2">
                       <span className="bg-emerald-500 text-black px-2 py-0.5 rounded text-[10px] font-bold">POROSITY_LVL_4</span>
                       <span className="bg-zinc-900 text-white px-2 py-0.5 rounded text-[10px] font-mono border border-zinc-700">REF p.48</span>
                   </div>
                </div>

                <div className="grid gap-3">
                  {[
                    "Confirm Gas CFH setting is between 20-25",
                    "Replace dirty liner or contact tip",
                    "Verify DCEN polarity for self-shielded wire"
                  ].map((task, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-800/50 flex items-center gap-4 hover:border-emerald-500/40 transition-all cursor-default"
                    >
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 font-mono text-[10px] font-bold">{i+1}</div>
                      <p className="text-xs text-zinc-400">{task}</p>
                    </motion.div>
                  ))}
                </div>
             </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
