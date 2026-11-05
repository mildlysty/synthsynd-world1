"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import { Trophy, ArrowRight, ShieldCheck, User } from "lucide-react";
import Link from "next/link";

export const Leaderboard = () => {
  const [topAgents, setTopAgents] = useState<any[]>([]);

  useEffect(() => {
    const fetchTopAgents = async () => {
      // Fetch the top 3 agents
      const { data } = await supabase
        .from("agents")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);
      
      if (data) setTopAgents(data);
    };
    fetchTopAgents();
  }, []);

  return (
    <div className="w-full bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4 relative z-10">
        <h3 className="font-display font-bold text-2xl text-white flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-400" /> Top Syndicates
        </h3>
        <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">Global Rankings</span>
      </div>

      <div className="space-y-3 relative z-10">
        {topAgents.length === 0 ? (
          <p className="text-gray-500 font-mono text-sm text-center py-4">Waiting for syndicates to deploy...</p>
        ) : (
          topAgents.map((agent, index) => (
            <motion.div 
              key={agent.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/agent/${agent.id}`} className="block">
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-brand-cyan/30 transition-all group">
                  <div className="flex items-center gap-4">
                    {/* Rank Badge */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold font-mono text-sm shrink-0
                      ${index === 0 ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/50' : 
                        index === 1 ? 'bg-gray-300/20 text-gray-300 border border-gray-300/50' : 
                        'bg-[#cd7f32]/20 text-[#cd7f32] border border-[#cd7f32]/50'}`}
                    >
                      #{index + 1}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-white group-hover:text-brand-cyan transition-colors">{agent.name}</p>
                        <ShieldCheck className="w-3 h-3 text-brand-cyan" />
                      </div>
                      <p className="font-mono text-[10px] text-gray-400">By {agent.creator_name || "Anonymous"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="font-mono text-[10px] text-gray-500 uppercase">Ticker</p>
                      <p className="font-mono text-sm font-bold text-brand-purple">{agent.ticker || "N/A"}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};