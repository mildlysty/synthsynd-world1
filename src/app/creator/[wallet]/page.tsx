"use client";
import { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/Header";
import { GridBackground } from "@/components/GridBackground";
import { AgentCard } from "@/components/AgentCard";
import { supabase } from "@/lib/supabaseClient";
import { User, Box, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";

function CreatorProfileContent() {
  const params = useParams();
  const walletAddress = params.wallet as string;
  
  const [profile, setProfile] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreatorData = async () => {
      if (!walletAddress) return;

      // Fetch Profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("wallet_address", walletAddress)
        .single();
      
      if (profileData) setProfile(profileData);

      // Fetch Items
      const { data: itemsData } = await supabase
        .from("agents")
        .select("*")
        .eq("creator_wallet", walletAddress)
        .order("created_at", { ascending: false });
      
      if (itemsData) setItems(itemsData);
      setLoading(false);
    };
    fetchCreatorData();
  }, [walletAddress]);

  if (loading) return <div className="min-h-screen bg-brand-dark flex items-center justify-center text-brand-cyan font-mono">Decrypting Creator Data...</div>;

  return (
    <main className="min-h-screen relative overflow-hidden bg-brand-dark pt-40 pb-20 px-6">
      <GridBackground />
      <Header />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Creator Header */}
        <div className="flex flex-col md:flex-row items-center gap-8 border-b border-white/10 pb-10 mb-10">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#0a0a0f] border-2 border-brand-purple/30 flex items-center justify-center shadow-[0_0_40px_rgba(177,108,234,0.15)] overflow-hidden">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-16 h-16 text-gray-500" />
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-brand-purple text-white p-1.5 rounded-full border-4 border-[#050505]">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </motion.div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-3">
              {profile?.username || "Anonymous Creator"}
            </h1>
            <p className="font-mono text-sm text-gray-400 bg-black/40 px-4 py-1.5 rounded-lg border border-white/5 inline-block mb-6">
              {walletAddress}
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-3">
                <Box className="w-4 h-4 text-brand-cyan" />
                <span className="font-mono text-xs text-gray-300">{items.length} Items Published</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-3">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="font-mono text-xs text-gray-300">{profile?.xp || 0} XP Earned</span>
              </div>
            </div>
          </div>
        </div>

        {/* Creator's Portfolio */}
        <div>
          <h2 className="text-2xl font-display font-bold text-white mb-6">Portfolio</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.length === 0 ? (
              <div className="col-span-3 text-center py-20 border border-white/10 border-dashed rounded-xl">
                <p className="text-gray-400 font-mono text-sm">This creator hasn't published any items yet.</p>
              </div>
            ) : (
              items.map(item => <AgentCard key={item.id} agent={item} />)
            )}
          </div>
        </div>

      </div>
    </main>
  );
}

export default function CreatorProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-dark flex items-center justify-center text-brand-cyan font-mono">Loading...</div>}>
      <CreatorProfileContent />
    </Suspense>
  );
}