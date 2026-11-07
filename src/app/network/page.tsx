"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Activity, Trophy, Zap, User } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react"; // Import wallet hook
import { createClient } from "@supabase/supabase-js"; // Import Supabase
import MonthlyAirdropBanner from "@/components/MonthlyAirdropBanner";

// Initialize Supabase (Put these in your .env.local file!)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

type UserData = {
  wallet_address: string;
  username: string;
  xp: number;
  streak: number;
  rank?: number; // Calculated dynamically
};

export default function NetworkPage() {
  const { publicKey, connected } = useWallet(); // Get connected wallet
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [leaderboard, setLeaderboard] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);

      // 1. Fetch the Top 100 REAL users from your database
      // We order by 'xp' descending, and limit to 100.
      const { data: topUsers, error } = await supabase
        .from("users") // Make sure this matches your actual table name
        .select("wallet_address, username, xp, streak")
        .order("xp", { ascending: false })
        .limit(100);

      if (error) {
        console.error("Error fetching leaderboard:", error);
        setIsLoading(false);
        return;
      }

      if (topUsers) {
        // 2. Add the Rank number dynamically based on their position in the array
        const rankedUsers = topUsers.map((user, index) => ({
          ...user,
          rank: index + 1,
        }));

        setLeaderboard(rankedUsers);

        // 3. Find the current logged-in user in the list
        if (connected && publicKey) {
          const walletAddress = publicKey.toBase58();
          const me = rankedUsers.find(
            (u) => u.wallet_address === walletAddress
          );

          // If they are in the Top 100, set their data. If not, they are "Unranked"
          setCurrentUser(
            me || {
              wallet_address: walletAddress,
              username: "Unranked",
              xp: 0,
              streak: 0,
              rank: 999, // Fake rank to show "Unranked" in the UI
            }
          );
        } else {
          setCurrentUser(null);
        }
      }

      setIsLoading(false);
    };

    fetchLeaderboard();

    // Optional: Re-fetch every 30 seconds to keep it live
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, [connected, publicKey]); // Re-run when wallet connects/disconnects

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center text-white">
        <div className="animate-pulse flex flex-col items-center">
          <Activity className="w-10 h-10 text-cyan-400 mb-4 animate-spin" />
          <p>Loading Real Network Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-purple-500/30">
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        
        {/* Header */}
        <div className="flex flex-col mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit mb-6">
            <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-xs font-bold tracking-wider text-gray-300 uppercase">Live Network Monitor</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Syndicate <span className="text-gray-500">Network</span>
          </h1>
        </div>

        {/* Airdrop Banner */}
        <MonthlyAirdropBanner 
          currentRank={currentUser?.rank || 0} 
          currentXp={currentUser?.xp || 0} 
        />

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
                
                {connected ? (
                   <h3 className="text-7xl font-bold text-white mb-8">
                     {currentUser && currentUser.rank && currentUser.rank <= 100 
                       ? `#${currentUser.rank}` 
                       : "Unranked"}
                   </h3>
                ) : (
                  <h3 className="text-3xl font-bold text-gray-500 mb-8 mt-6">Connect Wallet</h3>
                )}
                
                <div className="w-full flex justify-between items-end border-t border-white/10 pt-6">
                  <div>
                    <p className="text-gray-500 text-xs mb-1 uppercase tracking-wider">Your XP</p>
                    <p className="text-2xl font-bold text-white">{connected ? currentUser?.xp || 0 : 0} <span className="text-sm text-gray-500">XP</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 text-xs mb-1 uppercase tracking-wider">Streak</p>
                    <p className="text-2xl font-bold text-orange-500">{connected ? currentUser?.streak || 0 : 0} <span className="text-sm text-orange-500/70">Days</span></p>
                  </div>
                </div>
              </div>

              <Link href="/profile" className="w-full block">
                <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3 rounded-xl transition-all">
                  Go to Dashboard
                </button>
              </Link>
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
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Top 100 Real Users</p>
              </div>

              <div className="space-y-3">
                {leaderboard.length === 0 ? (
                  <p className="text-gray-500 text-center py-10">No users found. Be the first to earn XP!</p>
                ) : (
                  leaderboard.map((user) => (
                    <div 
                      key={user.wallet_address}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                        user.rank === 1 ? "bg-yellow-500/5 border-yellow-500/20" : 
                        user.rank === 2 ? "bg-gray-400/5 border-gray-400/20" :
                        user.rank === 3 ? "bg-orange-500/5 border-orange-500/20" : 
                        "bg-white/5 border-white/5 hover:border-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          user.rank === 1 ? "bg-yellow-500 text-black" : 
                          user.rank === 2 ? "bg-gray-400 text-black" :
                          user.rank === 3 ? "bg-orange-500 text-white" : 
                          "bg-white/10 text-gray-400"
                        }`}>
                          {user.rank}
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-white font-bold text-sm">
                              {user.username || "Anonymous"}
                            </p>
                            {/* Show shortened wallet address */}
                            <p className="text-gray-500 text-xs font-mono">
                              {user.wallet_address ? `${user.wallet_address.slice(0,4)}...${user.wallet_address.slice(-4)}` : "Unknown"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-cyan-400" />
                        <p className="text-white font-bold">{user.xp.toLocaleString()} <span className="text-gray-500 text-sm">XP</span></p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}