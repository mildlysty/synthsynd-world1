"use client";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Activity, ShieldCheck, Zap, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";
import { toast } from "sonner";

export const AgentCard = ({ agent }: { agent: any }) => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [isBuying, setIsBuying] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [8, -8]);
  const rotateY = useTransform(x, [-100, 100], [-8, 8]);

  const handleMouse = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - (rect.left + rect.width / 2));
    y.set(event.clientY - (rect.top + rect.height / 2));
  };

  const handleBuy = async (e: React.MouseEvent) => {
    e.preventDefault(); // Stop the Link from triggering
    if (!publicKey) return toast.error("Please connect your wallet first!");
    
    const price = parseFloat(agent.price);
    if (price <= 0) return; 

    setIsBuying(true);
    try {
      const creatorWallet = new PublicKey(agent.creator_wallet);
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: creatorWallet,
          lamports: price * 1e9, // Convert SOL to lamports
        })
      );
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");

      // Record purchase in DB
      await supabase.from("purchases").insert([{ buyer_wallet: publicKey.toBase58(), item_id: agent.id }]);
      
      toast.success("Purchase Successful!", {
        description: "You now own this item. Check your wallet.",
      });

    } catch (err: any) {
      console.error(err);
      if (err.message.includes("User rejected")) {
        toast.error("Transaction cancelled.");
      } else {
        toast.error("Purchase failed. Check your SOL balance.");
      }
    } finally {
      setIsBuying(false);
    }
  };

  return (
    <Link href={`/agent/${agent.id}`} className="block h-full">
      <div style={{ perspective: 1000 }} className="h-full">
        <motion.div 
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          onMouseMove={handleMouse}
          onMouseLeave={() => { x.set(0); y.set(0); }}
          className="relative group bg-[#0a0a0f] border border-white/10 hover:border-brand-cyan/50 rounded-2xl p-6 cursor-pointer h-full flex flex-col justify-between transition-colors duration-300 shadow-xl"
        >
          <div style={{ transform: "translateZ(30px)" }}>
            {/* Header: Title & Status */}
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-xl text-white line-clamp-1">{agent.name}</h3>
                <ShieldCheck className="w-4 h-4 text-brand-cyan shrink-0" />
              </div>
              <div className="flex items-center gap-1.5 bg-black/60 px-2 py-1 rounded-full border border-white/10 shrink-0">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Live</span>
              </div>
            </div>

            {/* Creator Username */}
            <div className="flex items-center gap-1.5 mb-4">
              <User className="w-3 h-3 text-gray-500" />
              <span className="font-mono text-[10px] text-gray-400">
                By {agent.creator_name || (agent.creator_wallet ? `${agent.creator_wallet.slice(0, 4)}...${agent.creator_wallet.slice(-4)}` : "Anonymous")}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-gray-400 line-clamp-3 mb-6 min-h-[48px] leading-relaxed">
              {agent.description || "No description provided."}
            </p>
          </div>

          {/* Stats & Buy Button */}
          <div style={{ transform: "translateZ(25px)" }} className="mt-auto">
            <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-4 mb-4 text-center">
              <div>
                <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-1">Ticker</p>
                <p className="font-mono text-xs font-bold text-brand-purple">{agent.ticker || "N/A"}</p>
              </div>
              <div>
                <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-1">Rep</p>
                <p className="font-mono text-xs font-bold text-white flex items-center justify-center gap-1">5.0 <Zap className="w-3 h-3 text-yellow-400" /></p>
              </div>
              <div>
                <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-1">Jobs</p>
                <p className="font-mono text-xs font-bold text-white flex items-center justify-center gap-1">0 <Activity className="w-3 h-3 text-brand-cyan" /></p>
              </div>
            </div>

            {agent.price > 0 ? (
               <button 
                onClick={handleBuy}
                disabled={isBuying}
                className="w-full py-2.5 bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan font-bold font-mono text-xs rounded-lg hover:bg-brand-cyan hover:text-black transition-colors flex items-center justify-center gap-2"
               >
                 <ShoppingCart className="w-3 h-3" />
                 {isBuying ? "PROCESSING..." : `BUY FOR ${agent.price} SOL`}
               </button>
            ) : (
              <div className="w-full py-2.5 bg-white/5 border border-white/5 text-gray-500 font-bold font-mono text-xs rounded-lg text-center">
                FREE / OPEN ACCESS
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </Link>
  );
};