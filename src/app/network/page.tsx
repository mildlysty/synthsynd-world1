"use client";

import React from "react";
import { Activity, Trophy, Zap, User } from "lucide-react";
import MonthlyAirdropBanner from "@/components/MonthlyAirdropBanner"; // Ensure this path is correct

// --- MOCK DATA ---
// Replace these with your actual database/state variables
const mockUser = {
  rank: 1,
  xp: 350,
  streak: 2,
};

const mockLeaderboard = [
  { rank: 1, name: "Dev1", wallet: "GdMF..Vizm", xp: 350 },
  { rank: 2, name: "Dev01", wallet: "AycP..XJFW", xp: 150 },
  { rank: 3, name: "Luee", wallet: "7sHn..yopi", xp: 150 },
  { rank: 4, name: "Vibha", wallet: "J1fF..omum", xp: 150 },
];

export default function NetworkPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-purple-500/30">
      {/* Background Grid Pattern (Optional, matches your site) */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        
        {/* Header Section */}
        <div className="flex flex-col mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit mb-6">
            <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-xs font-bold tracking-wider text-gray-300 uppercase">Live Network Monitor</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Syndicate <span className="text-gray-500">Network</span>
          </h1>
        </div>

        {/* NEW: Monthly Airdrop Banner */}
        <MonthlyAirdropBanner currentRank={mockUser.rank} currentXp={mockUser.xp} />

        {/* Main Grid: Standing & Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          
          {/* Left Column: Your Standing */}
          <div className="lg:col-span-1">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 relative overflow-hidden flex flex-col h-full shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full pointer-events-none"></div>
              
              <div className="flex items-center gap-2 text-gray-400 mb-8">
                <User className="w-5 h-5" />
                <h2 className="text-sm font-bold uppercase tracking-wider">Your Standing</h2>
              </div>

              <div className="flex flex-col items-center justify-center mb-10 flex-grow">
                <p className="text-gray-400 text-sm mb-2">Current Rank</p>
                <h3 className="text-7xl font-bold text-white mb-8">#{mockUser.rank}</h3>
                
                <div className="w-full flex justify-between items-end border-t border-white/10 pt-6">
                  <div>
                    <p className="text-gray-500 text-xs mb-1 uppercase tracking-wider">Your XP</p>
                    <p className="text-2xl font-bold text-white">{mockUser.xp} <span className="text-sm text-gray-500">XP</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 text-xs mb-1 uppercase tracking-wider">Streak</p>
                    <p className="text-2xl font-bold text-orange-500">{mockUser.streak} <span className="text-sm text-orange-500/70">Days</span></p>
                  </div>
                </div>
              </div>

              <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3 rounded-xl transition-all">
                Go to Dashboard
              </button>
            </div>
          </div>

          {/* Right Column: Global Leaderboard */}
          <div className="lg:col-span-2">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 relative overflow-hidden h-full shadow-lg">
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 blur-3xl rounded-full pointer-events-none"></div>

              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  <h2 className="text-xl font-bold text-white">Global Leaderboard</h2>
                </div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Top 10 Users by XP</p>
              </div>

              <div className="space-y-3">
                {mockLeaderboard.map((user) => (
                  <div 
                    key={user.rank}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      user.rank === 1 ? "bg-yellow-500/5 border-yellow-500/20" : 
                      user.rank === 2 ? "bg-gray-400/5 border-gray-400/20" :
                      user.rank === 3 ? "bg-orange-500/5 border-orange-500/20" : 
                      "bg-white/5 border-white/5 hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Rank Badge */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        user.rank === 1 ? "bg-yellow-500 text-black" : 
                        user.rank === 2 ? "bg-gray-400 text-black" :
                        user.rank === 3 ? "bg-orange-500 text-white" : 
                        "bg-white/10 text-gray-400"
                      }`}>
                        {user.rank}
                      </div>
                      
                      {/* User Info */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm">{user.name}</p>
                          <p className="text-gray-500 text-xs font-mono">{user.wallet}</p>
                        </div>
                      </div>
                    </div>

                    {/* XP */}
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-cyan-400" />
                      <p className="text-white font-bold">{user.xp} <span className="text-gray-500 text-sm">XP</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}