"use client";
import { useState, useEffect } from "react";
import { AgentCard } from "./AgentCard";
import { supabase } from "@/lib/supabaseClient";
import { Plus, Search, X, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";

export const Marketplace = () => {
  const { publicKey } = useWallet();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Agents");
  const [searchQuery, setSearchQuery] = useState(""); // <-- NEW SEARCH STATE
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "", ticker: "", price: "0", creatorName: "" });

  const tabs = ["Agents", "Prompts", "Tools", "Bundles"];

  const fetchItems = async (category: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("agents")
      .select("*")
      .eq("category", category)
      .order("created_at", { ascending: false });

    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    const category = activeTab.slice(0, -1); 
    fetchItems(category);
  }, [activeTab]);

  // 🚨 REAL SEARCH LOGIC
  const filteredItems = items.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) || 
      (item.ticker && item.ticker.toLowerCase().includes(query)) ||
      (item.creator_name && item.creator_name.toLowerCase().includes(query))
    );
  });

  const handlePost = async () => {
    if (!publicKey) return alert("Please connect your wallet first.");
    setIsPosting(true);
    const category = activeTab.slice(0, -1);
    
    const { error } = await supabase.from("agents").insert([
      {
        name: formData.name,
        description: formData.description,
        ticker: formData.ticker || "$N/A",
        category: category,
        creator_wallet: publicKey.toBase58(),
        price: parseFloat(formData.price) || 0,
        creator_name: formData.creatorName || "Anonymous"
      }
    ]);

    if (!error) {
      setIsModalOpen(false);
      setFormData({ name: "", description: "", ticker: "", price: "0", creatorName: "" });
      fetchItems(category); 
    } else {
      alert("Error publishing. Check console.");
    }
    setIsPosting(false);
  };

  return (
    <section id="agents" className="relative w-full py-24 px-6 md:px-24 bg-[#050505] z-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-xs font-mono text-brand-cyan mb-4">
              SYNTHSYND MARKETPLACE
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-4">
              The Agentic <span className="text-white/40">Economy</span>
            </h2>
          </div>
          
          <button onClick={() => setIsModalOpen(true)} suppressHydrationWarning className="px-6 py-3 bg-white text-black font-bold font-mono text-sm rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Publish {activeTab.slice(0, -1)}
          </button>
        </div>

        {/* TABS & SEARCH */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setSearchQuery(""); }} // Reset search on tab change
                suppressHydrationWarning
                className={`px-6 py-2.5 rounded-full font-mono text-xs font-bold transition-colors whitespace-nowrap ${
                  activeTab === tab 
                    ? "bg-white text-black" 
                    : "bg-transparent text-gray-400 border border-white/10 hover:border-white/30"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="relative w-full md:w-72">
               <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
               <input 
                 type="text" 
                 placeholder="Search by name, ticker, or creator..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)} // <-- CONNECTED
                 suppressHydrationWarning 
                 className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm font-mono text-white outline-none focus:border-brand-cyan transition-colors" 
               />
             </div>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="text-gray-500 font-mono text-sm col-span-3 animate-pulse">Syncing data...</p>
          ) : filteredItems.length === 0 ? ( // <-- USE FILTERED ITEMS
               <div className="col-span-3 text-center py-20 border border-white/10 border-dashed rounded-xl">
                  <p className="text-gray-400 font-mono text-sm mb-4">
                    {searchQuery ? "No items match your search." : `No ${activeTab.toLowerCase()} deployed yet.`}
                  </p>
               </div>
          ) : (
            filteredItems.map((item) => ( // <-- USE FILTERED ITEMS
              <AgentCard key={item.id} agent={item} />
            ))
          )}
        </div>
      </div>
      
      {/* ... Keep your Modal code here ... */}
    </section>
  );
};