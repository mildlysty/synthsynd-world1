"use client";

import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Loader2, Upload, Link as LinkIcon, Terminal } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = ["Commerce", "Legal", "Gaming", "Healthcare", "Finance", "Education", "Technology", "Marketing", "Sales", "Customer Support", "Research", "Public Safety", "Other"];

export default function PublishPage() {
  const { publicKey } = useWallet();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Technology",
    type: "Agent",
    prompt: "",
    endpoint_url: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey) return toast.error("Connect your wallet to publish.");
    if (!formData.name || !formData.description) return toast.error("Name and Description are required.");

    setLoading(true);

    // 🚨 100% FREE: Just insert into database, no transactions!
    const { error } = await supabase.from("agents").insert({
      name: formData.name,
      description: formData.description,
      capability: formData.category,
      category: formData.category,
      type: formData.type,
      price_sol: 0, 
      prompt: formData.prompt,
      endpoint_url: formData.endpoint_url,
      creator_wallet: publicKey.toBase58(),
      creator_username: "Dev_" + publicKey.toBase58().slice(0, 4),
      ticker: formData.name.slice(0, 4).toUpperCase()
    });

    setLoading(false);

    if (error) {
      toast.error("Failed to publish: " + error.message);
    } else {
      toast.success("Successfully Published for FREE!");
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-32 pb-20 px-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-cyan/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-2xl mx-auto bg-[#0a0a0f] border border-white/10 rounded-3xl p-8 md:p-12 relative z-10 shadow-2xl">
        
        <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-6">
          <Terminal className="w-6 h-6 text-brand-cyan" />
          <div>
            <h1 className="text-2xl font-bold">Initialize Agent</h1>
            <p className="text-green-400 text-xs font-mono mt-1">SYSTEM_READY_TO_DEPLOY (100% FREE)</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">Agent Identifier</label>
            <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-brand-cyan outline-none font-mono text-sm" placeholder="e.g. Athena_Alpha_01" />
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">Execution Directive (Description)</label>
            <textarea required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-brand-cyan outline-none h-24 text-sm" placeholder="Describe the core logic and purpose of this agent..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">Category</label>
              <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white outline-none font-mono text-sm">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">Type</label>
              <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white outline-none font-mono text-sm">
                <option value="Agent">Live AI Agent</option>
                <option value="Tool">API / Tool</option>
                <option value="Bundle">Multi-Agent Bundle</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider flex items-center gap-2">
              <LinkIcon className="w-3 h-3" /> Live App URL (Optional)
            </label>
            <input type="url" value={formData.endpoint_url} onChange={(e) => setFormData({...formData, endpoint_url: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-brand-cyan outline-none font-mono text-sm" placeholder="https://your-streamlit-app.streamlit.app" />
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">System Prompt (Optional)</label>
            <textarea value={formData.prompt} onChange={(e) => setFormData({...formData, prompt: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-brand-cyan outline-none h-24 font-mono text-sm" placeholder="You are a helpful AI assistant..." />
          </div>

          <button disabled={loading} type="submit" className="w-full py-4 bg-brand-cyan text-black font-bold rounded-xl hover:bg-[#20d4b6] transition-all flex items-center justify-center gap-2 mt-4">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
            {loading ? "Deploying..." : "EXECUTE DEPLOYMENT (FREE)"}
          </button>
        </form>

      </div>
    </div>
  );
}