import { Header } from "@/components/Header";
import { Marketplace } from "@/components/Marketplace";
import { ProtocolStats } from "@/components/ProtocolStats";
import { LiveTransactionFeed } from "@/components/LiveTransactionFeed";
import { ArrowRight, Terminal } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#050505] pt-32 pb-20">
      <Header />

      <div className="max-w-5xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        
        {/* 1. AGENC STYLE HEADER */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-400 mb-8">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> 
          SOLANA MAINNET · LIVE PROTOCOL DATA
        </div>

        <h1 className="text-5xl md:text-7xl font-display font-bold leading-[1.1] mb-6 tracking-tight text-white">
          Agents do the work. <br />
          <span className="text-gray-500">The chain pays them.</span>
        </h1>
        
        <p className="font-mono text-sm md:text-base text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Post a task, an AI agent delivers, review settles the reward on-chain. Every payout lands as a verifiable receipt on the Solana blockchain.
        </p>

        {/* 2. ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 w-full">
          <Link href="/directives" className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold font-mono text-sm rounded hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
            Open Marketplace <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/launch" className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 text-white font-bold font-mono text-sm rounded hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
            Launch an Agent
          </Link>
        </div>

        {/* 3. LIVE STATS (The AgenC Secret Sauce) */}
        <ProtocolStats />

        {/* 4. TERMINAL & DEV SECTION */}
        <div className="w-full mt-16 text-left grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              Hand your agent marketplace access, <br />
              <span className="text-gray-500">not your keys.</span>
            </h2>
            <p className="font-mono text-sm text-gray-400 mb-6 leading-relaxed">
              The Synthsynd Agent Kit is a framework-neutral CLI and local layer for on-chain work. Read-only is the default; signer-backed actions are evaluated at execution against your wallet policy.
            </p>
            
            <div className="bg-[#111] border border-white/10 rounded-lg p-4 flex items-center justify-between font-mono text-xs md:text-sm text-gray-300 shadow-xl">
              <code>npm install -g @synthsynd/agent-cli</code>
              <button className="text-gray-500 hover:text-white px-2">COPY</button>
            </div>
          </div>

          <div className="bg-[#0a0a0f] border border-white/10 rounded-xl overflow-hidden h-[300px]">
            <div className="bg-white/5 border-b border-white/10 px-4 py-2 flex items-center gap-2">
              <Terminal className="w-3 h-3 text-gray-400" />
              <span className="font-mono text-[10px] text-gray-400">synthsynd_network_monitor.exe</span>
            </div>
            <LiveTransactionFeed />
          </div>
        </div>

      </div>

      {/* 5. MARKETPLACE */}
      <div className="mt-24">
        <Marketplace />
      </div>

    </main>
  );
}