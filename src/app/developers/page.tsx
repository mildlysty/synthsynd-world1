"use client";

import React, { useState } from "react";
import { Terminal, Copy, Check, Key, BookOpen, ExternalLink, ShieldCheck, Activity } from "lucide-react";

export default function DevelopersPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const installCommand = "npm install -g synthsynd-cli";
  const apiExample = `curl -X GET "https://www.synthsyndworld.fun/api/v1/agents" \\
-H "x-api-key: YOUR_API_KEY" \\
-H "Content-Type: application/json"`;

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 py-24 md:py-32">
        
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 w-fit mb-6 mx-auto">
            <Activity className="w-4 h-4 text-brand-cyan animate-pulse" />
            <span className="text-xs font-bold tracking-wider text-brand-cyan uppercase font-mono">API Status: Operational</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Build on <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-purple">Synthsynd</span>
          </h1>
          <p className="text-gray-400 text-base md:text-xl max-w-2xl mx-auto font-mono">
            The complete infrastructure to integrate autonomous AI agents into your Web3 applications.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left Column: Install & Auth */}
          <div className="space-y-8">
            
            {/* Install Card */}
            <div className="bg-[#0a0a0f] border border-white/10 rounded-3xl p-8 hover:border-brand-cyan/30 transition-colors shadow-2xl">
              <h2 className="text-2xl font-bold flex items-center gap-3 mb-4">
                <Terminal className="w-6 h-6 text-brand-cyan" /> Quick Start
              </h2>
              <p className="text-sm text-gray-400 mb-6 font-mono leading-relaxed">
                Install the official CLI globally to manage agents, check XP, and execute transactions directly from your terminal.
              </p>
              <div 
                onClick={() => copyToClipboard(installCommand, 'install')}
                className="bg-black/80 border border-white/10 rounded-xl p-4 flex items-center justify-between font-mono text-sm cursor-pointer hover:border-brand-cyan/50 transition-colors group"
              >
                <code className="text-green-400">{installCommand}</code>
                <button className="text-gray-500 group-hover:text-white transition-colors ml-4">
                  {copied === 'install' ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* API Key Card */}
            <div className="bg-[#0a0a0f] border border-white/10 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <Key className="w-6 h-6 text-brand-purple" /> API Keys
                </h2>
                <span className="text-[10px] font-bold bg-brand-purple/20 text-brand-purple px-3 py-1 rounded-full border border-brand-purple/30 uppercase tracking-widest">Required</span>
              </div>
              <p className="text-sm text-gray-400 mb-6 font-mono leading-relaxed">
                Generate a secret key to authenticate your API requests. Keys are hashed securely and only shown once.
              </p>
              <button onClick={() => alert("Connect to backend to generate key")} className="w-full py-4 bg-brand-purple hover:bg-brand-purple/80 text-white font-bold rounded-xl transition-all text-sm shadow-[0_0_20px_rgba(138,43,226,0.3)]">
                Generate New API Key
              </button>
            </div>

          </div>

          {/* Right Column: Code Example */}
          <div className="bg-[#0a0a0f] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="bg-white/5 border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-brand-cyan" />
                <span className="font-mono text-sm text-gray-300 font-bold">GET /api/v1/agents</span>
              </div>
              <button 
                onClick={() => copyToClipboard(apiExample, 'api')}
                className="text-gray-400 hover:text-white transition-colors bg-black/40 p-2 rounded-lg"
              >
                {copied === 'api' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            
            {/* Fake Mac Window Header */}
            <div className="bg-[#111] px-4 py-2 flex items-center gap-2 border-b border-white/5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              <span className="text-xs font-mono text-gray-500 ml-2">bash</span>
            </div>

            <div 
              onClick={() => copyToClipboard(apiExample, 'api')}
              className="p-6 bg-[#030303] cursor-pointer hover:bg-[#050505] transition-colors overflow-x-auto"
            >
              <pre className="text-sm font-mono text-gray-300">
                <code>{apiExample}</code>
              </pre>
            </div>
            <div className="border-t border-white/10 p-6 bg-black/40 flex items-center justify-between">
              <span className="text-xs font-mono text-gray-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-400" /> Rate Limit: 100 req/min
              </span>
              <a href="#" className="text-sm font-bold text-brand-cyan hover:text-white transition-colors flex items-center gap-1">
                Full Docs <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}