"use client";

import React, { useState, useEffect } from "react";
import { Gift, Clock, CheckCircle2, AlertCircle } from "lucide-react";

interface AirdropBannerProps {
  currentRank: number;
  currentXp: number;
}

export default function MonthlyAirdropBanner({ currentRank, currentXp }: AirdropBannerProps) {
  const isQualified = currentRank <= 100 && currentRank > 0;
  
  // 🚨 LIVE TIMER STATE 🚨
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Set the target date to the end of the current month (or change to a specific date)
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59); 
    
    // OPTIONAL: If you want a specific date (e.g., Dec 1st, 2026), use this instead:
    // const endOfMonth = new Date("2026-12-01T00:00:00Z").getTime();

    const interval = setInterval(() => {
      const currentTime = new Date().getTime();
      const distance = endOfMonth.getTime() - currentTime;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#0a0a0a] border border-white/10 rounded-3xl p-4 md:p-6 mb-8 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6 shadow-[0_0_40px_-15px_rgba(138,43,226,0.3)]">
      
      {/* Background Neon Glows */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/10 blur-3xl rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none"></div>

      {/* Left: Title & Info */}
      <div className="flex items-center gap-4 md:gap-5 relative z-10 w-full lg:w-auto">
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(138,43,226,0.2)]">
          <Gift className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-1">Monthly $SSDY Airdrop</h2>
          <p className="text-gray-400 text-xs md:text-sm max-w-md">
            The top 100 users with the highest XP at the end of the month are guaranteed an airdrop.
          </p>
        </div>
      </div>

      {/* Middle: LIVE Timer */}
      <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 md:px-5 py-2 md:py-3 rounded-xl relative z-10 w-full lg:w-auto justify-center">
        <Clock className="w-4 h-4 md:w-5 md:h-5 text-cyan-400 animate-pulse" />
        <div>
          <p className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider font-bold">Ends In</p>
          <p className="text-white font-mono font-bold text-sm md:text-base">
            {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
          </p>
        </div>
      </div>

      {/* Right: User Status */}
      <div className="relative z-10 w-full lg:w-auto flex justify-center lg:justify-end">
        {isQualified ? (
          <div className="flex items-center gap-3 md:gap-4 bg-green-500/10 border border-green-500/30 px-4 md:px-6 py-3 md:py-4 rounded-xl w-full lg:w-auto">
            <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-green-400 flex-shrink-0" />
            <div>
              <p className="text-green-400 font-bold text-sm md:text-base">You are Qualified!</p>
              <p className="text-green-500/70 text-xs md:text-sm">Current Rank: #{currentRank} ({currentXp.toLocaleString()} XP)</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 md:gap-4 bg-orange-500/10 border border-orange-500/30 px-4 md:px-6 py-3 md:py-4 rounded-xl w-full lg:w-auto">
            <AlertCircle className="w-6 h-6 md:w-8 md:h-8 text-orange-400 flex-shrink-0" />
            <div>
              <p className="text-orange-400 font-bold text-sm md:text-base">Not in Top 100</p>
              <p className="text-orange-500/70 text-xs md:text-sm">Grind XP to qualify before the month ends.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}