"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { AgentCard } from "./AgentCard";
import { Loader2, Search } from "lucide-react";
import Link from "next/link";

// The exact categories from your screenshot
const CATEGORIES = ["All", "Commerce", "Legal", "Gaming", "Healthcare", "Finance", "Education", "Technology", "Marketing", "Sales", "Customer Support", "Research", "Public Safety", "Other"];

export function Marketplace() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      // Fetch from your Supabase table
      const { data, error } = await supabase
        .from("agents")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) setAgents(data);
      setLoading(false);
    };
    fetchAgents();
  }, []);

  // Filter logic
  const filteredAgents = agents.filter((agent) => {
    const matchesCategory = activeCategory === "All" || agent.category === activeCategory;
    const matchesSearch = agent.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          agent.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-2">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-purple">Agents</span>
          </h2>
          <p className="text-gray-400 font-mono text-sm">Discover, build, and hire AI Agents.</p>
        </div>
        <Link href="/launch" className="px-6 py-3 bg-brand-cyan text-black font-bold rounded-xl hover:bg-[#20d4b6] transition-all">
          + Publish New
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Search agents, tools, or bundles..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-brand-cyan outline-none transition-colors"
        />
      </div>

      {/* Category Filter Bar (Swarms Style) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full whitespace-nowrap border text-sm font-mono transition-all ${
              activeCategory === cat 
                ? "bg-white text-black border-white font-bold" 
                : "bg-transparent text-gray-400 border-white/10 hover:border-white/30"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Agent Grid */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand-cyan" /></div>
      ) : filteredAgents.length === 0 ? (
        <div className="text-center py-20 border border-white/10 border-dashed rounded-2xl bg-white/5">
          <p className="text-gray-400">No items found in this category yet. Be the first to publish!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAgents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      )}
    </div>
  );
}