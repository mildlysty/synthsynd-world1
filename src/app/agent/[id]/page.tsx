"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Loader2, ArrowLeft, Copy, Check, ExternalLink, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

// Custom GitHub Icon SVG to bypass the lucide-react error
const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

export default function AgentDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const [agent, setAgent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchAgent = async () => {
      if (!id) return;
      const { data, error } = await supabase.from("agents").select("*").eq("id", id).single();
      if (data) setAgent(data);
      setLoading(false);
    };
    fetchAgent();
  }, [id]);

  const copyPrompt = () => {
    if (!agent?.prompt) return;
    navigator.clipboard.writeText(agent.prompt);
    setCopied(true);
    toast.success("Prompt copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-cyan w-10 h-10" />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-bold mb-4">Agent not found</h1>
        <Link href="/" className="text-brand-cyan hover:underline">Return to Marketplace</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-24 px-4 md:px-6 pb-20 relative overflow-hidden">
      
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-cyan/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <Link href="/" className="text-gray-400 hover:text-white flex items-center gap-2 mb-8 transition-colors font-mono text-sm">
          <ArrowLeft className="w-4 h-4" /> BACK TO MARKETPLACE
        </Link>

        <div className="bg-[#0a0a0f] border border-white/10 rounded-3xl p-6 md:p-10 mb-8 shadow-2xl">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded-full border border-green-500/20 uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> 100% Free
            </span>
            <span className="px-3 py-1 bg-brand-cyan/10 text-brand-cyan text-xs font-bold rounded-full border border-brand-cyan/20 uppercase tracking-widest">
              {agent.category || "Technology"}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">{agent.name}</h1>
          <p className="text-gray-400 text-base md:text-lg mb-6 max-w-3xl leading-relaxed">{agent.description}</p>

          <div className="flex items-center gap-3 text-sm font-mono text-gray-500 border-t border-white/10 pt-6">
            <span>Built by: <strong className="text-white">@{agent.creator_username || "Community"}</strong></span>
            {agent.github_url && (
              <a 
                href={agent.github_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-brand-cyan hover:text-white transition-colors ml-auto"
              >
                <GithubIcon className="w-4 h-4" /> View Source Code
              </a>
            )}
          </div>
        </div>

        <div className="bg-[#0a0a0f] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          {agent.endpoint_url ? (
            <div>
              <div className="bg-white/5 px-6 py-4 flex justify-between items-center border-b border-white/10">
                <span className="text-sm font-mono text-gray-300 font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Live Agent Interface
                </span>
                <a 
                  href={agent.endpoint_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-brand-cyan hover:text-white text-xs flex items-center gap-1 font-mono transition-colors"
                >
                  OPEN IN NEW TAB <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <iframe 
                src={agent.endpoint_url} 
                className="w-full h-[700px] bg-white" 
                title={agent.name}
              />
            </div>
          ) : agent.prompt ? (
            <div>
              <div className="bg-white/5 px-6 py-4 flex justify-between items-center border-b border-white/10">
                <span className="text-sm font-mono text-gray-300 font-bold">System Prompt</span>
                <button 
                  onClick={copyPrompt} 
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-xs font-mono bg-black/50 border border-white/10 px-3 py-1.5 rounded-lg"
                >
                  {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />} 
                  {copied ? "COPIED" : "COPY PROMPT"}
                </button>
              </div>
              <div className="p-6 md:p-8 bg-[#030303] overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {agent.prompt}
                </pre>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500 font-mono">
              This agent does not have a live interface or prompt attached yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}