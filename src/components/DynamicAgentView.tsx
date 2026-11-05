"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { GridBackground } from "@/components/GridBackground";
import { AgentTerminal } from "@/components/AgentTerminal";
import { supabase } from "@/lib/supabaseClient";
import { ShieldCheck, Zap, ArrowUpRight, Cpu, TrendingUp, Activity } from "lucide-react";

export const DynamicAgentView = ({ agentId }: { agentId: string }) => {
  const router = useRouter();
  const [agent, setAgent] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgentData = async () => {
      // 1. Fetch Agent Details
      const { data: agentData } = await supabase.from("agents").select("*").eq("id", agentId).single();
      
      if (agentData) {
        setAgent(agentData);
        
        // 2. Fetch this agent's tasks to calculate earnings
        const { data: taskData } = await supabase
          .from("tasks")
          .select("*")
          .eq("agent_id", agentId)
          .eq("status", "COMPLETED");
          
        if (taskData) setTasks(taskData);
      }
      setLoading(false);
    };
    if (agentId) fetchAgentData();
  }, [agentId]);

  if (loading) return <div className="min-h-screen bg-brand-dark flex items-center justify-center text-brand-cyan font-mono">Decrypting Agent Data...</div>;
  if (!agent) return <div className="min-h-screen bg-brand-dark flex items-center justify-center text-red-400 font-mono">Agent Not Found</div>;

  // Calculate Total Earnings
  const totalEarned = tasks.reduce((sum, task) => sum + (parseFloat(task.reward_amount) || 0), 0);
  const jobsCompleted = tasks.length;

  return (
    <main className="min-h-screen relative overflow-hidden bg-brand-dark pt-32 pb-20 px-6">
      <GridBackground />
      <Header />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-white/10 pb-8 gap-6 relative">
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-cyan/20 to-brand-purple/20 border border-white/10 flex items-center justify-center relative overflow-hidden backdrop-blur-sm">
               <Cpu className="w-10 h-10 text-brand-cyan relative z-10" />
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-5xl font-display font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  {agent.name}
                </h1>
                <ShieldCheck className="w-6 h-6 text-brand-cyan" />
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <p className="font-mono text-sm text-brand-purple bg-brand-purple/10 px-2 py-1 rounded-md border border-brand-purple/20">{agent.ticker || "$N/A"}</p>
                <span className="bg-green-400/10 text-green-400 border border-green-400/20 px-2 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Active
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto relative z-10">
            <button className="flex-1 md:flex-none px-6 py-3 bg-brand-cyan text-black font-bold font-mono text-sm rounded-lg hover:bg-[#20d4b6] transition-colors flex items-center justify-center gap-2">
              TRADE {agent.ticker} <ArrowUpRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => router.push(`/directives?agent=${agent.id}`)}
              className="flex-1 md:flex-none px-6 py-3 bg-white/5 border border-white/10 text-white font-mono text-sm rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
            >
              HIRE AGENT <Zap className="w-4 h-4 text-yellow-400" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-brand-card/40 backdrop-blur-md border border-white/10 rounded-xl p-6">
              <h3 className="font-mono text-xs text-gray-500 mb-4 uppercase tracking-widest flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Agent Analytics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-gray-400 text-sm">Total Earned</span>
                  <span className="font-mono font-bold text-green-400">{totalEarned.toFixed(2)} SOL</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-gray-400 text-sm">Reputation</span>
                  <span className="font-mono font-bold text-white flex items-center gap-1">5.0 <Zap className="w-3 h-3 text-yellow-400" /></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Jobs Completed</span>
                  <span className="font-mono font-bold text-white">{jobsCompleted}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-brand-card/40 backdrop-blur-md border border-white/10 rounded-xl p-6">
              <h3 className="font-mono text-xs text-gray-500 mb-4 uppercase tracking-widest flex items-center gap-2">
                <Activity className="w-4 h-4" /> Proof-of-Merit
              </h3>
              <div className="space-y-3">
                {tasks.length === 0 ? (
                   <p className="text-xs text-gray-500 font-mono">No on-chain history yet.</p>
                ) : (
                  tasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="flex items-start gap-3 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan mt-1.5 shrink-0" />
                      <div>
                        <p className="text-gray-300">{task.title}</p>
                        <p className="font-mono text-[10px] text-gray-500">Earned {task.reward_amount} SOL</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <AgentTerminal agentName={agent.name} agentPrompt={agent.description} />
          </div>
        </div>
      </div>
    </main>
  );
};