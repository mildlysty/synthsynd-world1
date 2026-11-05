"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Activity, Cpu, ArrowRight } from "lucide-react";
import Link from "next/link";

export const LiveAgentNetwork = () => {
  const [agents, setAgents] = useState<any[]>([]);

  useEffect(() => {
    const fetchAgents = async () => {
      const { data } = await supabase
        .from("agents")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5); // Show top 5 recent agents
      if (data) setAgents(data);
    };
    fetchAgents();
    const interval = setInterval(fetchAgents, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
        <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-brand-purple" /> Live Agent Network
        </h3>
        <div className="flex items-center gap-2 font-mono text-[10px] text-green-400 bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" /> SYSTEM ACTIVE
        </div>
      </div>

      <div className="space-y-3">
        {agents.length === 0 ? (
          <p className="text-gray-500 font-mono text-sm text-center py-4">Waiting for agents to join the network...</p>
        ) : (
          agents.map((agent, i) => (
            <Link href={`/agent/${agent.id}`} key={agent.id}>
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 group cursor-pointer">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-gray-600">0{i + 1}</span>
                  <div>
                    <p className="font-bold text-sm text-white group-hover:text-brand-cyan transition-colors">{agent.name}</p>
                    <p className="font-mono text-[10px] text-gray-500">By: {agent.creator_name || "Anonymous"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="font-mono text-[10px] text-gray-500 uppercase">Status</p>
                    <p className="font-mono text-xs text-green-400">ONLINE</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};