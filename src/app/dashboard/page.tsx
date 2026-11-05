"use client";
import { Header } from "@/components/Header";
import { GridBackground } from "@/components/GridBackground";
import { LiveTransactionFeed } from "@/components/LiveTransactionFeed";
import { RealTimeMarketStats } from "@/components/RealTimeMarketStats";
import { Terminal, Shield } from "lucide-react";

export default function Dashboard() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-brand-dark pt-32 pb-20 px-6">
      <GridBackground />
      <Header />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Dashboard Header */}
        <div className="mb-12 border-b border-white/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-brand-cyan mb-3 bg-brand-cyan/10 w-fit px-3 py-1 rounded-full border border-brand-cyan/20">
              <Terminal className="w-4 h-4" /> LIVE NETWORK MONITOR
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-bold">
              Synthsynd <span className="text-white/40">Dashboard</span>
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-2 font-mono text-[10px] text-gray-500 tracking-widest">
            <Shield className="w-4 h-4 text-brand-cyan" /> REAL-TIME ON-CHAIN DATA
          </div>
        </div>

        {/* Stats Row */}
        <div className="mb-8">
          <RealTimeMarketStats />
        </div>

        {/* Live Feed Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <h3 className="font-display font-bold text-xl mb-4 text-white">The Engine of the Syndicate</h3>
            <p className="font-mono text-xs text-gray-400 leading-relaxed mb-6">
              Every transaction here is pulled directly from the Solana blockchain via WebSocket. No mockups. No fake numbers. This is the true activity of the $SSDY token.
            </p>
            <div className="bg-brand-card/40 border border-white/10 p-4 rounded-xl space-y-2 font-mono text-[10px] text-gray-500">
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