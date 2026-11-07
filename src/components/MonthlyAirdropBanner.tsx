import React from "react";
import { Gift, Clock, Trophy, CheckCircle2, AlertCircle } from "lucide-react";

interface AirdropBannerProps {
  currentRank: number;
  currentXp: number;
}

export default function MonthlyAirdropBanner({ currentRank, currentXp }: AirdropBannerProps) {
  // Logic: If rank is <= 100 and > 0, they are qualified.
  const isQualified = currentRank <= 100 && currentRank > 0;

  return (
    <div className="w-full bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 mb-8 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 shadow-[0_0_40px_-15px_rgba(138,43,226,0.3)]">
      
      {/* Background Neon Glows */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/10 blur-3xl rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none"></div>

      {/* Left: Title & Info */}
      <div className="flex items-center gap-5 relative z-10 w-full lg:w-auto">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(138,43,226,0.2)]">
          <Gift className="w-8 h-8 text-purple-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Monthly $SSDY Airdrop</h2>
          <p className="text-gray-400 text-sm max-w-md">
            The top 100 users with the highest XP at the end of the month are guaranteed an airdrop.
          </p>
        </div>
      </div>

      {/* Middle: Timer */}
      <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-3 rounded-xl relative z-10 w-full lg:w-auto justify-center">
        <Clock className="w-5 h-5 text-cyan-400" />
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Ends In</p>
          <p className="text-white font-mono font-bold">12d 14h 32m</p>
        </div>
      </div>

      {/* Right: User Status */}
      <div className="relative z-10 w-full lg:w-auto flex justify-end">
        {isQualified ? (
          <div className="flex items-center gap-4 bg-green-500/10 border border-green-500/30 px-6 py-4 rounded-xl">
            <CheckCircle2 className="w-8 h-8 text-green-400" />
            <div>
              <p className="text-green-400 font-bold">You are Qualified!</p>
              <p className="text-green-500/70 text-sm">Current Rank: #{currentRank} ({currentXp.toLocaleString()} XP)</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 bg-orange-500/10 border border-orange-500/30 px-6 py-4 rounded-xl">
            <AlertCircle className="w-8 h-8 text-orange-400" />
            <div>
              <p className="text-orange-400 font-bold">Not in Top 100</p>
              <p className="text-orange-500/70 text-sm">Grind XP to qualify before the month ends.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}