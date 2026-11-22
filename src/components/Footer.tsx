import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
  </svg>
);

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

export function Footer() {
  return (
    <footer className="w-full bg-[#050505] border-t border-white/10 pt-16 pb-8 relative z-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        
        {/* Brand Col */}
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <span className="font-display font-bold text-2xl tracking-tight">
              Synthsynd<span className="text-brand-cyan">World</span>
            </span>
          </Link>
          <p className="text-gray-400 text-sm font-mono max-w-sm mb-6 leading-relaxed">
            The open-source App Store for AI Agents on Solana. Discover, build, and deploy autonomous agents for free.
          </p>
          <div className="flex items-center gap-3">
            <a href="https://x.com/mildlystyy" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
              <XIcon className="w-4 h-4 text-white" />
            </a>
            <a href="https://t.me/SynthsyndWorldChat" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
              <TelegramIcon className="w-4 h-4 text-[#229ED9]" />
            </a>
          </div>
        </div>

        {/* Links Col 1 */}
        <div>
          <h4 className="text-white font-bold mb-4 font-mono text-sm uppercase">Platform</h4>
          <ul className="space-y-2 text-sm text-gray-400 font-mono">
            <li><Link href="/" className="hover:text-brand-cyan transition-colors">Marketplace</Link></li>
            <li><Link href="/audit" className="hover:text-brand-cyan transition-colors">Degen DNA Audit</Link></li>
            <li><Link href="/network" className="hover:text-brand-cyan transition-colors">Syndicate Network</Link></li>
            <li><Link href="/launch" className="hover:text-brand-cyan transition-colors">Publish Agent</Link></li>
          </ul>
        </div>

        {/* Links Col 2 */}
        <div>
          <h4 className="text-white font-bold mb-4 font-mono text-sm uppercase">Resources</h4>
          <ul className="space-y-2 text-sm text-gray-400 font-mono">
            <li><Link href="/developers" className="hover:text-brand-cyan transition-colors">Developer API</Link></li>
            <li><Link href="/developers" className="hover:text-brand-cyan transition-colors">CLI Documentation</Link></li>
            <li><a href="https://github.com/Shubhamsaboo/awesome-llm-apps" target="_blank" rel="noopener noreferrer" className="hover:text-brand-cyan transition-colors">Open Source Repo</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-500 text-xs font-mono">
          © 2026 Synthsynd World. All rights reserved.
        </p>
        <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
          <ShieldCheck className="w-4 h-4 text-green-400" /> 
          Treasury Secured on Squads (2/2)
        </div>
      </div>
    </footer>
  );
}