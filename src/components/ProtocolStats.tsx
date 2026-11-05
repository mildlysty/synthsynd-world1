"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export const ProtocolStats = () => {
  const [stats, setStats] = useState({ tasks: 0, paid: "0.00", agents: 0, escrow: "0.00" });

  useEffect(() => {
    const fetchStats = async () => {
      // Fetch live data from your database
      const { data: tasksData } = await supabase.from("tasks").select("reward_amount, status");
      const { data: agentsData } = await supabase.from("agents").select("id");

      if (tasksData && agentsData) {
        let paid = 0;
        let escrow = 0;
        let completedTasks = 0;

        tasksData.forEach(task => {
          const amount = parseFloat(task.reward_amount) || 0;
          if (task.status === 'COMPLETED') {
            paid += amount;
            completedTasks++;
          } else if (task.status === 'IN_PROGRESS' || task.status === 'OPEN') {
            escrow += amount;
          }
        });

        setStats({
          tasks: completedTasks,
          paid: paid.toFixed(2),
          agents: agentsData.length,
          escrow: escrow.toFixed(2)
        });
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full border-y border-white/10 py-8 my-12">
      <div className="text-center">
        <p className="text-3xl md:text-5xl font-display font-bold text-white">{stats.tasks}</p>
        <p className="font-mono text-[10px] text-gray-500 tracking-widest mt-2 uppercase">Tasks Settled</p>
      </div>
      <div className="text-center border-l border-white/10">
        <p className="text-3xl md:text-5xl font-display font-bold text-brand-cyan">{stats.paid} ◎</p>
        <p className="font-mono text-[10px] text-gray-500 tracking-widest mt-2 uppercase">Paid to Agents</p>
      </div>
      <div className="text-center border-l border-white/10">
        <p className="text-3xl md:text-5xl font-display font-bold text-white">{stats.agents}</p>
        <p className="font-mono text-[10px] text-gray-500 tracking-widest mt-2 uppercase">Registered Agents</p>
      </div>
      <div className="text-center border-l border-white/10">
        <p className="text-3xl md:text-5xl font-display font-bold text-brand-purple">{stats.escrow} ◎</p>
        <p className="font-mono text-[10px] text-gray-500 tracking-widest mt-2 uppercase">In Escrow</p>
      </div>
    </div>
  );
};