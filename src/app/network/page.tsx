"use client";
import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Header } from "@/components/Header";
import { GridBackground } from "@/components/GridBackground";
import { supabase } from "@/lib/supabaseClient";
import { Trophy, User, Zap, TrendingUp, Shield, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function NetworkPage() {
  const { publicKey } = useWallet();
  const [topUsers, setTopUsers] = useState<any[]>([]);
  const [myProfile, setMyProfile] = useState<any>(null);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      // 1. Fetch Top 10 Users by XP
      const { data: topData } = await supabase
        .from("profiles")
        .select("*")
        .order("xp", { ascending: false })
        .limit(10);
      
      if (topData) setTopUsers(topData);

      // 2. Fetch My Profile & Calculate Rank
      if (publicKey) {
        const { data: myData } = await supabase
          .from("profiles")
          .select("*")
          .eq("wallet_address", publicKey.toBase58())
          .single();
        
        if (myData) {
          setMyProfile(myData);
          
          // Calculate user's rank
          const { count } = await supabase
            .from("profiles")
            .select("*", { count: 'exact', head: true })
            .gt("xp", myData.xp || 0);
            
          setMyRank((count || 0) + 1);
        }
      }
      setLoading(false);
    };
    fetchLeaderboard();
  }, [publicKey]);

  return (
    <main className="min-h-screen relative overflow-hidden bg-brand-dark pt-40 pb-20 px-6">
      <GridBackground />
      <Header />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Page Title */}
        <div className="mb-10 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 font-mono text-xs text-brand-cyan mb-3 bg-brand-cyan/10 w-fit mx-auto md:mx-0 px-3 py-1 rounded-full border border-brand-cyan/20">
            <Activity className="w-4 h-4" /> LIVE NETWORK MONITOR
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold">
            Syndicate <span className="text-white/40">Network</span>
          </h1>
        </div>

        {/* MAIN GRID: Left (Stats) / Right (Leaderboard) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT SIDE: YOUR STATS */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-[#0a0a0f] to-[#12121a] border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/10 rounded-full blur-[50px] pointer-events-none" />
              
              <h3 className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand-cyan" /> Your Standing
              </h3>

              {publicKey ? (
                <div className="space-y-8">
                  <div className="text-center">
                    <p className="font-mono text-sm text-gray-400 mb-1">Current Rank</p>
                    <h2 className="text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-white">
                      {myRank ? `#${myRank}` : "N/A"}
                    </h2>
                  </div>

                  <div className="flex justify-between items-center border-t border-white/10 pt-6">
                    <div>
                      <p className="font-mono text-xs text-gray-500 mb-1">Your XP</p>
                      <p className="text-2xl font-bold text-white">{myProfile?.xp || 0} XP</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-xs text-gray-500 mb-1">Streak</p>
                      <p className="text-2xl font-bold text-orange-400">{myProfile?.current_streak || 0} Days</p>
                    </div>
                  </div>

                  <a href="/profile" className="block w-full py-3 bg-white/5 border border-white/10 text-center text-sm font-mono text-white rounded-xl hover:bg-white/10 transition-colors">
                    Go to Dashboard
                  </a>
                </div>
              ) : (
                <div className="text-center py-10">
                  <User className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="font-mono text-sm text-gray-400">Connect your wallet to see your rank.</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDE: GLOBAL LEADERBOARD */}
          <div className="lg:col-span-2">
            <div className="bg-[#0a0a0f] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                <h3 className="font-display font-bold text-2xl text-white flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-400" /> Global Leaderboard
                </h3>
                <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest hidden sm:block">Top 10 Users by XP</span>
              </div>

              <div className="space-y-2">
                {loading ? (
                  <p className="text-gray-500 font-mono text-sm animate-pulse text-center py-10">Syncing leaderboard data...</p>
                ) : topUsers.length === 0 ? (
                  <p className="text-gray-500 font-mono text-sm text-center py-10">No users have earned XP yet.</p>
                ) : (
                  topUsers.map((user, index) => (
                    <motion.div 
                      key={user.wallet_address}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                        publicKey?.toBase58() === user.wallet_address 
                          ? "bg-brand-cyan/10 border-brand-cyan/30" 
                          : "bg-white/5 border-white/5 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Rank Number */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold font-mono text-sm shrink-0
                          ${index === 0 ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/50' : 
                            index === 1 ? 'bg-gray-300/20 text-gray-300 border border-gray-300/50' : 
                            index === 2 ? 'bg-[#cd7f32]/20 text-[#cd7f32] border border-[#cd7f32]/50' : 
                            'bg-black/40 text-gray-500 border border-white/10'}`}
                        >
                          {index + 1}
                        </div>
                        
                        {/* Avatar & Username */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-cyan/20 to-brand-purple/20 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                            {user.avatar_url ? (
                              <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-5 h-5 text-gray-500" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm">{user.username || "Anonymous"}</p>
                            <p className="font-mono text-[10px] text-gray-500">
                              {user.wallet_address.slice(0, 4)}...{user.wallet_address.slice(-4)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* XP */}
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-brand-cyan" />
                        <span className="font-mono text-sm font-bold text-white">{user.xp || 0} XP</span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}