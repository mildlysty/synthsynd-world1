"use client";

import React from "react";
import { ShieldCheck, Vault, Gift, ArrowUpRight, Lock, Users, Calendar } from "lucide-react";

export default function TreasuryDashboard() {
  // Your actual Squads Multisig details
  const SQUADS_LINK = "https://app.squads.so/squads/42f4x3uL5Hyv71doCJZMXwRTdyo6GKND9VfCV2KYj9Sd/home";
  const TREASURY_BALANCE = "0.07 SOL"; // You can fetch this live later
  const WEEKLY_AIRDROP_POOL = "5,000,000 $SSDY";
  
  return (
    <div className="w-full bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-[0_0_50px_rgba(42,245,210,0.05)] mb-12">
      {/* Background Glow Effects */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cyan/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-purple/5 blur-[100px] pointer-events-none" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 relative z-10 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-white flex items-center gap-3">
            <Vault className="w-8 h-8 text-brand-cyan" /> Protocol Treasury
          </h2>
          <p className="font-mono text-sm text-gray-400 mt-2">
            Secured by Squads Multisig (2/2). Fully transparent.
          </p>
        </div>
        <a 
          href={SQUADS_LINK} 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-4 md:mt-0 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl text-sm font-bold text-white transition-all flex items-center gap-2"
        >
          Verify on Squads <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        
        {/* Card 1: Total Balance */}
        <div className="bg-black/40 border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Lock className="w-4 h-4 text-green-400" />
            <p className="font-mono text-xs text-gray-500 uppercase tracking-wider">Locked Balance</p>
          </div>
          <p className="text-3xl font-bold text-white mb-2">{TREASURY_BALANCE}</p>
          <p className="text-xs font-mono text-gray-500">Requires 2/2 Signatures to move.</p>
        </div>

        {/* Card 2: Weekly Airdrop */}
        <div className="bg-black/40 border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Gift className="w-4 h-4 text-brand-purple" />
            <p className="font-mono text-xs text-gray-500 uppercase tracking-wider">Weekly Airdrop Pool</p>
          </div>
          <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-white mb-2">{WEEKLY_AIRDROP_POOL}</p>
          <p className="text-xs font-mono text-gray-500">Distributed every Sunday to top XP holders.</p>
        </div>

        {/* Card 3: Security Details */}
        <div className="bg-black/40 border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-4 h-4 text-brand-cyan" />
            <p className="font-mono text-xs text-gray-500 uppercase tracking-wider">Security Status</p>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <p className="text-xl font-bold text-white">2/2 Signatures</p>
          </div>
          <p className="text-xs font-mono text-gray-500">Fees are safely routed to this vault.</p>
        </div>

      </div>

      {/* Airdrop Explanation Box */}
      <div className="mt-6 bg-brand-cyan/5 border border-brand-cyan/20 rounded-2xl p-5 relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Calendar className="w-8 h-8 text-brand-cyan" />
          <div>
            <h4 className="text-white font-bold">Weekly XP Airdrop</h4>
            <p className="text-sm text-gray-400 font-mono">The treasury funds weekly rewards for the highest XP grinders.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-black/50 px-4 py-2 rounded-lg border border-white/10">
          <Users className="w-4 h-4 text-gray-400" />
          <p className="text-sm text-white font-bold">Top 100 Users</p>
        </div>
      </div>

    </div>
  );
}