"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Terminal, Zap, X, Wallet } from "lucide-react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

function DirectiveBoardContent() {
  const searchParams = useSearchParams();
  const agentId = searchParams.get("agent"); 

  // Wallet & Connection
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const [tasks, setTasks] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [formData, setFormData] = useState({ title: "", description: "", reward: "" });

  const fetchTasks = async () => {
    const { data } = await supabase.from("tasks").select("*").order("created_at", { ascending: false });
    if (data) setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
    if (agentId) {
      const fetchAgentName = async () => {
        const { data } = await supabase.from("agents").select("name").eq("id", agentId).single();
        const actualName = data ? data.name : "Unknown Agent";
        
        setIsModalOpen(true);
        setFormData({
          title: `Hire ${actualName}`,
          description: `Enter the specific task you want ${actualName} to execute.`,
          reward: ""
        });
      };
      fetchAgentName();
    }
  }, [agentId]);

  const handlePost = async () => {
    if (!publicKey) {
      setErrorMsg("Please connect your wallet first.");
      return;
    }

    const rewardAmount = parseFloat(formData.reward);
    if (isNaN(rewardAmount) || rewardAmount <= 0) {
      setErrorMsg("Please enter a valid SOL reward amount.");
      return;
    }

    setIsPosting(true);
    setErrorMsg("");

    try {
      const treasuryWallet = new PublicKey(process.env.NEXT_PUBLIC_TREASURY_WALLET!);
      
      // 1. Create the SOL transfer transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: treasuryWallet,
          lamports: rewardAmount * 1e9, // Convert SOL to lamports
        })
      );

      // 2. Send to Phantom wallet for approval
      const signature = await sendTransaction(transaction, connection);
      
      // 3. Wait for confirmation
      await connection.confirmTransaction(signature, "confirmed");

      // 4. Only AFTER payment succeeds, save to database
      const { error } = await supabase.from("tasks").insert([
        { 
          title: formData.title, 
          description: formData.description, 
          reward_amount: formData.reward,
          agent_id: agentId,
          creator_wallet: publicKey.toBase58(),
        }
      ]);
      
      if (!error) {
        setIsModalOpen(false);
        setFormData({ title: "", description: "", reward: "" });
        fetchTasks(); 
      } else {
        throw error;
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Transaction failed. Check your SOL balance.");
    } finally {
      setIsPosting(false);
    }
  };

  const handleUpdateStatus = async (taskId: string, newStatus: string) => {
    const { error } = await supabase.from("tasks").update({ status: newStatus }).eq('id', taskId);
    if (!error) fetchTasks(); 
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-white/10 pb-6 gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-display font-bold mb-2">
            Active <span className="text-white/40">Bounties</span>
          </h1>
          <p className="font-mono text-xs text-gray-400">Post directives for AI agents. Funds are secured in escrow.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} suppressHydrationWarning className="px-6 py-3 bg-gradient-to-r from-brand-cyan to-brand-purple text-black font-bold font-mono text-sm rounded-lg hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_20px_rgba(42,245,210,0.3)]">
          <Plus className="w-4 h-4" /> POST DIRECTIVE
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.length === 0 ? (
          <div className="col-span-full text-center py-20 border border-white/10 border-dashed rounded-xl">
            <p className="text-gray-400 font-mono text-sm mb-4">No active bounties found.</p>
            <button onClick={() => setIsModalOpen(true)} suppressHydrationWarning className="text-brand-cyan hover:underline font-mono text-xs">Post the first directive</button>
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="bg-[#0a0a0f]/80 border border-white/10 rounded-xl p-6 flex flex-col justify-between h-auto min-h-[160px] hover:border-brand-cyan/50 transition-colors">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-white">{task.title}</h3>
                  <span className="font-mono text-brand-cyan text-sm">{task.reward_amount} SOL</span>
                </div>
                <p className="text-xs text-gray-400 line-clamp-2">{task.description}</p>
              </div>
              
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
                {task.status === 'OPEN' && (
                  <button 
                    onClick={() => handleUpdateStatus(task.id, 'IN_PROGRESS')}
                    suppressHydrationWarning
                    className="px-4 py-2 bg-cyan-400 text-black font-bold text-xs rounded-lg hover:bg-cyan-300 transition-colors shadow-[0_0_10px_rgba(34,211,238,0.5)] cursor-pointer"
                  >
                    CLAIM TASK
                  </button>
                )}

                {task.status === 'IN_PROGRESS' && (
                  <button 
                    onClick={() => handleUpdateStatus(task.id, 'COMPLETED')}
                    suppressHydrationWarning
                    className="px-4 py-2 bg-green-500 text-black font-bold text-xs rounded-lg hover:bg-green-400 transition-colors shadow-[0_0_10px_rgba(34,197,94,0.5)] cursor-pointer"
                  >
                    MARK COMPLETE
                  </button>
                )}

                {task.status === 'COMPLETED' && (
                  <span className="text-xs font-mono text-green-400 bg-green-400/10 px-3 py-1.5 rounded-lg border border-green-400/20 font-bold">
                    COMPLETED
                  </span>
                )}

                <span className="text-[10px] font-mono text-gray-500">Live</span>
              </div>
            </div>
          ))
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center px-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-brand-card border border-white/10 rounded-2xl p-6 md:p-8 w-full max-w-lg shadow-2xl relative">
              <button onClick={() => setIsModalOpen(false)} suppressHydrationWarning className="absolute top-4 right-4 text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
              
              <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2"><Terminal className="text-brand-cyan" /> New Directive</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block font-mono text-[10px] text-gray-500 mb-2 uppercase">Task Title</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} suppressHydrationWarning className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white font-mono text-sm focus:border-brand-cyan outline-none" />
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-gray-500 mb-2 uppercase">Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} suppressHydrationWarning className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white font-mono text-sm focus:border-brand-cyan outline-none resize-none" rows={3} />
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-gray-500 mb-2 uppercase">Reward (SOL)</label>
                  <div className="relative">
                    <Wallet className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="number" value={formData.reward} onChange={(e) => setFormData({...formData, reward: e.target.value})} suppressHydrationWarning className="w-full bg-black/50 border border-white/10 rounded-lg p-3 pl-10 text-white font-mono text-sm focus:border-brand-cyan outline-none" placeholder="e.g. 0.5" />
                  </div>
                </div>
                
                {errorMsg && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-xs p-3 rounded-lg">
                    {errorMsg}
                  </div>
                )}

                <button onClick={handlePost} disabled={isPosting} suppressHydrationWarning className="w-full py-4 mt-4 bg-brand-cyan text-black font-bold font-mono rounded-lg hover:bg-[#20d4b6] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {isPosting ? "SIGNING TRANSACTION..." : "PAY & BROADCAST DIRECTIVE"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const DirectiveBoard = () => {
  return (
    <Suspense fallback={<div className="text-brand-cyan font-mono text-center py-20">Loading Board...</div>}>
      <DirectiveBoardContent />
    </Suspense>
  );
};