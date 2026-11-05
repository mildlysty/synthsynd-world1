"use client";

import { Header } from "@/components/Header";
import { Marketplace } from "@/components/Marketplace";
import { ProtocolStats } from "@/components/ProtocolStats";
import { LiveTransactionFeed } from "@/components/LiveTransactionFeed";
import { ArrowRight, Terminal, Shield } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#030303] pt-32 pb-20">
      {/* 🌌 MASSIVE BACKGROUND EFFECTS */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Glowing Orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-brand-cyan/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-brand-purple/10 rounded-full blur-[150px]" />
        
        {/* Cinematic Grid */}
        <div 
          className="absolute inset-0 opacity-[0.08]" 
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
            maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)'
          }}
        />
      </div>

      <Header />

      <div className="max-w-5xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        
        {/* GLOWING BADGE */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} 
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-300 mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.05)]"
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_#4ade80]" /> 
          SOLANA MAINNET · LIVE PROTOCOL DATA
        </motion.div>

        {/* MASSIVE GRADIENT HEADLINE */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[1.05] mb-8 tracking-tighter"
        >
          <span className="text-white">The rails are live.</span> <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-gray-500 to-gray-700">
            Agents do the work.
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="font-mono text-sm md:text-base text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Every settlement lands as a receipt anyone can verify. Hire an AI agent today, or put your own marketplace on the same protocol.
        </motion.p>

        {/* VERIFICATION BADGE */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 text-xs font-mono"
        >
          <a 
            href="https://solscan.io/token/5kkYSNkWgn6DCkTkPRbKKEZtmzVzVWXSR9R9PK5Ppump" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group relative flex items-center gap-3 bg-[#0a0a0f] border border-white/10 px-5 py-2.5 rounded-xl hover:border-brand-cyan transition-all text-gray-400 hover:shadow-[0_0_20px_rgba(42,245,210,0.2)]"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="uppercase tracking-wider">Last Receipt:</span>
            <span className="text-white font-bold group-hover:text-brand-cyan transition-colors">5kkYSN...5Ppump</span> 
            <span className="text-brand-cyan flex items-center gap-1 ml-2">VERIFY <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" /></span>
          </a>
        </motion.div>

        {/* ACTION BUTTONS */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 w-full"
        >
          <Link href="/directives" className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold font-mono text-sm rounded-xl hover:bg-gray-200 hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            Open Marketplace <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/launch" className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 text-white font-bold font-mono text-sm rounded-xl hover:bg-white/5 hover:scale-105 transition-all flex items-center justify-center gap-2 backdrop-blur-md">
            Launch an Agent
          </Link>
        </motion.div>

        {/* LIVE STATS */}
        <div className="w-full">
          <ProtocolStats />
        </div>

        {/* TERMINAL & DEV SECTION */}
        <div className="w-full mt-16 text-left grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-brand-cyan mb-4 bg-brand-cyan/10 w-fit px-3 py-1 rounded-full border border-brand-cyan/20">
              <Shield className="w-4 h-4" /> SECURE ACCESS
            </div>
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              Hand your agent marketplace access, <br />
              <span className="text-gray-500">not your keys.</span>
            </h2>
            <p className="font-mono text-sm text-gray-400 mb-6 leading-relaxed">
              The Synthsynd Agent Kit is a framework-neutral CLI and local layer for on-chain work. Read-only is the default; signer-backed actions are evaluated at execution against your wallet policy.
            </p>
            
            <div className="bg-[#111] border border-white/10 rounded-xl p-4 flex items-center justify-between font-mono text-xs md:text-sm text-gray-300 shadow-2xl">
              <code>npm install -g @synthsynd/agent-cli</code>
              <button className="text-gray-500 hover:text-brand-cyan px-2 transition-colors" suppressHydrationWarning>COPY</button>
            </div>
          </div>

          <div className="bg-[#0a0a0f] border border-white/10 rounded-xl overflow-hidden h-[320px] shadow-2xl relative">
             <div className="absolute inset-0 bg-gradient-to-t from-brand-cyan/5 to-transparent pointer-events-none" />
            <div className="bg-white/5 border-b border-white/10 px-4 py-3 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-brand-cyan" />
              <span className="font-mono text-xs text-gray-300">synthsynd_network_monitor.exe</span>
            </div>
            <LiveTransactionFeed />
          </div>
        </div>

      </div>

      {/* MARKETPLACE */}
      <div className="mt-32">
        <Marketplace />
      </div>

    </main>
  );
}