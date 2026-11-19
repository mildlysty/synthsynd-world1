"use client";

import React, { useState } from "react";
import { Terminal, Copy, Check, Key, BookOpen, ExternalLink } from "lucide-react";

export default function DevelopersPage() {
  const [copied, setCopied] = useState<string | null>(null);

  // This function handles the copying
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

      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Build on <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-purple">Synthsynd</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto">
            The complete toolkit to integrate AI agents into your applications. Install the CLI, generate an API key, and start building in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-8">
            {/* Install Card */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                <Terminal className="w-5 h-5 text-brand-cyan" /> Quick Start
              </h2>
              <p className="text-sm text-gray-400 mb-4 font-mono">
                Install the CLI globally to manage agents, check XP, and execute transactions from your terminal.
              </p>
              
              {/* 🚨 THE COPYABLE COMMAND BLOCK 🚨 */}
              <div 
                onClick={() => copyToClipboard(installCommand, 'install')}
                className="bg-black/50 border border-white/10 rounded-xl p-4 flex items-center justify-between font-mono text-sm cursor-pointer hover:border-brand-cyan/50 transition-colors group"
              >
                <code className="text-green-400">{installCommand}</code>
                <button className="text-gray-500 group-hover:text-white transition-colors ml-4">
                  {copied === 'install' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              {copied === 'install' && (
                 <p className="text-[10px] text-green-400 mt-2 text-right animate-in fade-in">Copied to clipboard!</p>
              )}
            </div>

            {/* API Key Card */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Key className="w-5 h-5 text-brand-purple" /> API Keys
                </h2>
                <span className="text-[10px] font-bold bg-brand-purple/20 text-brand-purple px-2 py-1 rounded-md">Required</span>
              </div>
              <p className="text-sm text-gray-400 mb-6">
                Generate a secret key to authenticate your API requests. Keep this key secure and never expose it in client-side code.
              </p>
              <button onClick={() => alert("Connect this to your backend API to generate a real key.")} className="w-full py-3 bg-brand-purple hover:bg-brand-purple/80 text-white font-bold rounded-xl transition-all text-sm">
                Generate New API Key
              </button>
              <p className="text-[10px] text-gray-500 mt-3 text-center">Keys are only displayed once. Store them securely.</p>
            </div>
          </div>

          {/* API Example Card */}
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden">
            <div className="bg-white/5 border-b border-white/10 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-brand-cyan" />
                <span className="font-mono text-xs text-gray-300">API Reference / GET /api/v1/agents</span>
              </div>
              <button onClick={() => copyToClipboard(apiExample, 'api')} className="text-gray-500 hover:text-white transition-colors">
                {copied === 'api' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div 
              onClick={() => copyToClipboard(apiExample, 'api')}
              className="p-4 md:p-6 bg-[#030303] cursor-pointer hover:bg-[#050505] transition-colors"
            >
              <pre className="text-sm font-mono text-gray-300 overflow-x-auto">
                <code>{apiExample}</code>
              </pre>
            </div>
            <div className="border-t border-white/10 p-4 bg-black/20">
              <a href="#" className="text-sm text-brand-cyan hover:underline flex items-center gap-1">
                Read full documentation <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}