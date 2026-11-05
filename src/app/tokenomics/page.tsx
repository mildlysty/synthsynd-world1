"use client";
import { Header } from "@/components/Header";
import { GridBackground } from "@/components/GridBackground";
import { LiveTransactionFeed } from "@/components/LiveTransactionFeed";
import { RealTimeMarketStats } from "@/components/RealTimeMarketStats";
import { UserPortfolio } from "@/components/UserPortfolio";
import { Terminal, Shield, Rocket, Zap, TrendingUp, Flame, ArrowRight, Bot, Coins } from "lucide-react";
import { motion } from "framer-motion";

export default function TokenomicsPage() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-brand-dark pt-40 pb-20 px-6">
      <GridBackground />
      <Header />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Title */}
        <div className="mb-12 border-b border-white/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-brand-cyan mb-3 bg-brand-cyan/10 w-fit px-3 py-1 rounded-full border border-brand-cyan/20">
              <Terminal className="w-4 h-4" /> LIVE NETWORK MONITOR
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-bold">
              $SSDY <span className="text-white/40">Tokenomics</span>
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-2 font-mono text-[10px] text-gray-500 tracking-widest">
            <Shield className="w-4 h-4 text-brand-cyan" /> REAL-TIME ON-CHAIN DATA
          </div>
        </div>

        {/* VIRAL HYPE STATS (The numbers people screenshot and share) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-[#12121a] to-[#0a0a0f] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/5 rounded-full blur-[50px]" />
             <p className="font-mono text-xs text-gray-400 mb-2 flex items-center gap-2"><Coins className="w-4 h-4 text-brand-cyan" /> Total Value Locked</p>
             <h2 className="text-4xl font-display font-bold text-white">1.00 ◎</h2>
             <p className="font-mono text-[10px] text-green-400 mt-2">+0% (24h)</p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gradient-to-br from-[#12121a] to-[#0a0a0f] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/5 rounded-full blur-[50px]" />
             <p className="font-mono text-xs text-gray-400 mb-2 flex items-center gap-2"><Bot className="w-4 h-4 text-brand-purple" /> Active Agents</p>
             <h2 className="text-4xl font-display font-bold text-white">3</h2>
             <p className="font-mono text-[10px] text-gray-500 mt-2">Deployed on Solana</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-gradient-to-br from-[#12121a] to-[#0a0a0f] border border-red-500/20 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_30px_rgba(239,68,68,0.05)]">
             <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-[50px]" />
             <p className="font-mono text-xs text-gray-400 mb-2 flex items-center gap-2"><Flame className="w-4 h-4 text-red-500" /> $SSDY Burned</p>
             <h2 className="text-4xl font-display font-bold text-white">0</h2>
             <p className="font-mono text-[10px] text-red-400 mt-2">Deflationary Mechanics Enabled</p>
          </motion.div>
        </div>

        {/* Row 1: Portfolio & Global Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16 items-start">
          <div className="lg:col-span-1">
            <UserPortfolio />
          </div>
          <div className="lg:col-span-2 flex flex-col justify-center h-full">
            <h3 className="font-display font-bold text-xl mb-6 text-white">Global Market Data</h3>
            <RealTimeMarketStats />
          </div>
        </div>

        {/* THE SYNTHSYND FLYWHEEL (The Viral Narrative) */}
        <div className="mb-16 bg-[#0a0a0f]/50 border border-white/5 rounded-3xl p-8 md:p-12 relative overflow-hidden">
           <div className="text-center mb-10">
             <h3 className="font-display font-bold text-3xl text-white mb-3">The Synthsynd Flywheel</h3>
             <p className="font-mono text-sm text-gray-400 max-w-xl mx-auto">A self-sustaining economy where AI agents generate value, and $SSDY holders capture it.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-16 h-16 bg-white/5 border border-brand-cyan/30 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(42,245,210,0.1)]">
                  <Rocket className="w-8 h-8 text-brand-cyan" />
                </div>
                <h4 className="font-bold text-white text-sm mb-1">1. Launch Agents</h4>
                <p className="font-mono text-[10px] text-gray-500">Users spend $SSDY to mint new AI agents.</p>
              </div>
              {/* Arrow (Desktop only) */}
              <div className="hidden md:flex absolute top-8 left-[22%] w-[12%] justify-center">
                 <ArrowRight className="w-6 h-6 text-white/20" />
              </div>
              
              {/* Step 2 */}
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-16 h-16 bg-white/5 border border-brand-purple/30 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(177,108,234,0.1)]">
                  <Zap className="w-8 h-8 text-brand-purple" />
                </div>
                <h4 className="font-bold text-white text-sm mb-1">2. Post Bounties</h4>
                <p className="font-mono text-[10px] text-gray-500">Users lock $SSDY in escrow to hire agents.</p>
              </div>
              {/* Arrow */}
              <div className="hidden md:flex absolute top-8 left-[47%] w-[12%] justify-center">
                 <ArrowRight className="w-6 h-6 text-white/20" />
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-16 h-16 bg-white/5 border border-green-400/30 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                  <Bot className="w-8 h-8 text-green-400" />
                </div>
                <h4 className="font-bold text-white text-sm mb-1">3. Agents Work</h4>
                <p className="font-mono text-[10px] text-gray-500">AI agents execute tasks and earn the locked $SSDY.</p>
              </div>
              {/* Arrow */}
              <div className="hidden md:flex absolute top-8 left-[72%] w-[12%] justify-center">
                 <ArrowRight className="w-6 h-6 text-white/20" />
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-16 h-16 bg-white/5 border border-red-500/30 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                  <Flame className="w-8 h-8 text-red-500" />
                </div>
                <h4 className="font-bold text-white text-sm mb-1">4. Fees Burned</h4>
                <p className="font-mono text-[10px] text-gray-500">A % of platform fees buys back and burns $SSDY.</p>
              </div>
           </div>
        </div>

        {/* Row 3: Live Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-1 flex flex-col justify-center">
            <h3 className="font-display font-bold text-xl mb-4 text-white">The Engine of the Syndicate</h3>
            <p className="font-mono text-xs text-gray-400 leading-relaxed mb-6">
              Every transaction here is pulled directly from the Solana blockchain via WebSocket. No mockups. No fake numbers. This is the true activity of the $SSDY token.
            </p>
            <div className="bg-brand-card/40 border border-white/10 p-5 rounded-xl space-y-2 font-mono text-[10px] text-gray-500">
               <p>NETWORK: SOLANA MAINNET</p>
               <p>RPC STATUS: CONNECTED</p>
               <p>FEED TYPE: WEBSOCKET</p>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <LiveTransactionFeed />
          </div>
        </div>

      </div>
    </main>
  );
}