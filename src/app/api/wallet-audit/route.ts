"use client";

import { useState, useEffect } from "react"; // 🚨 Added useEffect
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Sparkles, TrendingUp, Share2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function WalletAuditPage() {
  const { publicKey, connected } = useWallet();
  const [loading, setLoading] = useState(false);
  const [audit, setAudit] = useState<any>(null);
  
  // 🚨 ADDED: This fixes the missing wallet button glitch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const generateAudit = async () => {
    if (!publicKey) return toast.error("Connect your wallet first!");
    setLoading(true);
    
    try {
      const res = await fetch("/api/wallet-audit", {
        method: "POST",
        body: JSON.stringify({ walletAddress: publicKey.toBase58() }),
      });
      const data = await res.json();
      
      if (data.success) {
        setAudit(data.audit);
        toast.success("Audit complete! +500 XP added.");
      } else {
        toast.error(data.error || "Failed to generate audit.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const shareOnX = () => {
    const text = `Just got my Synthsynd AI Wallet Audit! 🧬\n\nMy Degen DNA: ${audit.personality} (${audit.score}/100)\n\n"${audit.roast}"\n\nCheck your wallet score at synthsyndworld.fun/audit`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col items-center pt-32 pb-20 px-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-cyan/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="text-center mb-10 relative z-10">
        <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 flex items-center gap-3 justify-center">
          <Sparkles className="text-brand-cyan w-8 h-8 md:w-12 md:h-12" /> Degen DNA Audit
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Let our AI scan your Solana wallet and reveal your true crypto personality. Will you survive the roast?
        </p>
      </div>

      <div className="w-full max-w-md bg-[#0a0a0f] border border-white/10 rounded-3xl p-8 relative overflow-hidden z-10 shadow-2xl">
        
        {/* 🚨 FIXED: Added mounted check for wallet button */}
        {!connected && mounted && (
          <div className="flex flex-col items-center py-6">
            <p className="text-gray-400 mb-6 font-mono text-sm">Connect your wallet to begin.</p>
            <WalletMultiButton className="!bg-[#2af5d2] !text-black !font-bold !rounded-xl !h-12 !px-8 hover:!bg-[#20d4b6] !transition-all" />
          </div>
        )}

        {/* 🚨 FIXED: Added hardcoded hex color so it doesn't blend in */}
        {connected && !audit && !loading && (
          <button 
            onClick={generateAudit} 
            className="w-full py-4 bg-[#2af5d2] text-black font-bold text-lg rounded-xl hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(42,245,210,0.3)]"
          >
            <TrendingUp className="w-5 h-5" /> Analyze My Wallet
          </button>
        )}

        {loading && (
          <div className="flex flex-col items-center py-10">
            <Loader2 className="w-10 h-10 animate-spin text-brand-cyan mb-4" />
            <p className="font-mono text-sm text-gray-400 animate-pulse">Scanning the Solana blockchain...</p>
            <p className="font-mono text-xs text-gray-600 mt-2">Running AI analysis...</p>
          </div>
        )}

        {audit && (
          <div className="animate-in fade-in zoom-in duration-500">
            <div className="text-center mb-6">
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-2 font-mono">Your Archetype</p>
              <h2 className="text-3xl font-display font-bold text-brand-cyan">{audit.personality}</h2>
            </div>

            <div className="bg-black/50 rounded-xl p-4 mb-4 border border-white/5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400 font-mono">Degen Score</span>
                <span className="font-bold text-xl">{audit.score}/100</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-brand-cyan h-full rounded-full transition-all duration-1000" style={{ width: `${audit.score}%` }}></div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
              <p className="text-gray-300 italic text-sm">"{audit.roast}"</p>
            </div>
            
            <div className="bg-brand-purple/10 border border-brand-purple/30 rounded-xl p-4 mb-6">
              <p className="text-xs text-brand-purple font-bold uppercase mb-1 font-mono">AI Alpha</p>
              <p className="text-sm text-white">{audit.advice}</p>
            </div>

            <button 
              onClick={shareOnX} 
              className="w-full py-3 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-all"
            >
              <Share2 className="w-4 h-4" /> Share on X
            </button>

            <button 
              onClick={() => { setAudit(null); generateAudit(); }} 
              className="w-full py-3 mt-3 bg-transparent text-gray-400 font-mono text-xs hover:text-white transition-colors"
            >
              Re-run Audit
            </button>
          </div>
        )}

      </div>
    </div>
  );
}