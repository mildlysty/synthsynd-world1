"use client";

import { motion, AnimatePresence } from "framer-motion";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

// Custom X (Twitter) Logo SVG
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
  </svg>
);

// Custom Telegram Logo SVG
const TelegramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

export const Header = () => {
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Navigation Links (Added AUDIT)
  const navLinks = [
    { name: "MARKETPLACE", href: "/" },
    { name: "AUDIT", href: "/audit" }, 
    { name: "NETWORK", href: "/network" },
    { name: "DEVELOPERS", href: "/developers" },
    { name: "PROFILE", href: "/profile", highlight: true },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
      className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-[100]"
    >
      <div className="bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 md:px-6 flex items-center justify-between shadow-2xl shadow-black/80">
        
        {/* 🟢 LEFT: Logo & Name */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 cursor-pointer group">
            <motion.div whileHover={{ rotate: 180, scale: 1.1 }} transition={{ duration: 0.8 }} className="w-8 h-8 md:w-10 md:h-10 relative">
              <Image src="/logo.png" alt="Synthsynd World" fill sizes="40px" className="object-contain" />
            </motion.div>
            <span className="font-display font-bold text-lg md:text-xl tracking-tight group-hover:text-white transition-colors">
              Synthsynd<span className="text-brand-cyan">World</span>
            </span>
          </Link>
        </div>

        {/* 🟡 CENTER: Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 font-mono text-[11px] xl:text-xs text-gray-400">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              href={link.href} 
              className={`${link.highlight ? "text-brand-cyan font-bold" : "hover:text-white"} transition-colors whitespace-nowrap`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* 🔴 RIGHT: Desktop Socials, Wallet & Buy */}
        <div className="hidden lg:flex items-center gap-3">
          
          {/* Social Icons */}
          <div className="flex items-center gap-1 border-r border-white/10 pr-3 mr-1">
            <a 
              href="https://x.com/mildlystyy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all"
            >
              <XIcon className="w-4 h-4" />
            </a>
            <a 
              href="https://t.me/SynthsyndWorldChat" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-[#229ED9] bg-white/5 hover:bg-[#229ED9]/10 rounded-lg transition-all"
            >
              <TelegramIcon className="w-4 h-4" />
            </a>
          </div>

          {/* Wallet Connect */}
          <div>
            {mounted && (
              <WalletMultiButton className="!bg-transparent !border !border-white/20 hover:!bg-white/5 !rounded-full !h-10 !px-4 !font-mono !text-xs !transition-all" />
            )}
          </div>

          {/* Buy Button */}
          <a 
            href="https://pump.fun/coin/5kkYSNkWgn6DCkTkPRbKKEZtmzVzVWXSR9R9PK5Ppump" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-brand-purple hover:bg-[#9b5cd6] transition-all text-white font-bold font-mono text-xs px-5 py-2.5 rounded-full flex items-center gap-1.5 shadow-[0_0_15px_rgba(177,108,234,0.4)] hover:scale-105 whitespace-nowrap"
          >
            Buy $SSDY ↗
          </a>

        </div>

        {/* 🟣 MOBILE: Right Side (Icons + Hamburger) */}
        <div className="flex lg:hidden items-center gap-2">
          <a href="https://t.me/SynthsyndWorldChat" target="_blank" rel="noopener noreferrer" className="p-2 text-[#229ED9] bg-[#229ED9]/10 rounded-lg">
            <TelegramIcon className="w-4 h-4" />
          </a>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="p-2 text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* 📱 MOBILE DROPDOWN MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden absolute top-[calc(100%+10px)] left-0 right-0 bg-[#0a0a0f]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-4"
          >
            {/* Links */}
            <nav className="flex flex-col gap-2 font-mono text-sm">
              {navLinks.map((link) => (
                <Link 
                  key={link.name}
                  href={link.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`p-3 rounded-xl transition-all ${
                    link.highlight 
                      ? "bg-brand-cyan/10 text-brand-cyan font-bold border border-brand-cyan/20" 
                      : "text-gray-300 hover:bg-white/5"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="h-px w-full bg-white/10 my-1" />

            {/* Mobile Actions */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-mono text-xs uppercase tracking-wider">Join Community</span>
                <div className="flex gap-2">
                  <a href="https://x.com/mildlystyy" target="_blank" rel="noopener noreferrer" className="p-2.5 text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                    <XIcon className="w-4 h-4" />
                  </a>
                  <a href="https://t.me/SynthsyndWorldChat" target="_blank" rel="noopener noreferrer" className="p-2.5 text-[#229ED9] bg-[#229ED9]/10 hover:bg-[#229ED9]/20 rounded-xl transition-colors">
                    <TelegramIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {mounted && (
                <WalletMultiButton className="!w-full !justify-center !bg-white/5 !border !border-white/10 !rounded-xl !h-12 !font-mono !text-sm hover:!bg-white/10 !transition-all" />
              )}

              <a 
                href="https://pump.fun/coin/5kkYSNkWgn6DCkTkPRbKKEZtmzVzVWXSR9R9PK5Ppump" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-brand-purple hover:bg-[#9b5cd6] transition-colors text-white font-bold font-mono text-sm py-3 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(177,108,234,0.4)]"
              >
                Buy $SSDY ↗
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.header>
  );
};