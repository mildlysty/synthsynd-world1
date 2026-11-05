"use client";
import { motion } from "framer-motion";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export const Header = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
      className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50"
    >
      <div className="bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 md:px-6 flex flex-col md:flex-row items-center justify-between shadow-2xl shadow-black/80 gap-4 md:gap-0">
        
        {/* Left Side: Logo & Navigation */}
        <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
          <Link href="/" className="flex items-center gap-3 cursor-pointer">
            <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.8 }} className="w-8 h-8 md:w-10 md:h-10 relative">
              <Image src="/logo.png" alt="Synthsynd World" fill sizes="40px" className="object-contain" />
            </motion.div>
            <span className="font-display font-bold text-lg md:text-xl tracking-tight">
              Synthsynd<span className="text-brand-cyan">World</span>
            </span>
          </Link>

          {/* Navigation Links - Clean & No Scrollbar */}
          <nav className="flex items-center justify-center gap-4 md:gap-6 font-mono text-[10px] md:text-xs text-gray-400 w-full md:w-auto py-2 md:py-0 border-t border-white/10 md:border-t-0 md:border-l md:pl-6">
            <Link href="/launch" className="hover:text-brand-cyan transition-colors whitespace-nowrap">LAUNCHPAD</Link>
            <Link href="/tokenomics" className="hover:text-brand-cyan transition-colors whitespace-nowrap">TOKENOMICS</Link>
            <Link href="/network" className="hover:text-brand-cyan transition-colors whitespace-nowrap">NETWORK</Link>
            <Link href="/users" className="hover:text-brand-cyan transition-colors whitespace-nowrap">CREATORS</Link>
            <Link href="/#agents" className="hover:text-brand-cyan transition-colors whitespace-nowrap">SYNDICATES</Link>
            <Link href="/profile" className="text-brand-cyan font-bold hover:text-white transition-colors whitespace-nowrap">PROFILE</Link>
          </nav>
        </div>

        {/* Right Side: Wallet & Buy Button */}
        <div className="flex items-center justify-center md:justify-end w-full md:w-auto gap-3 mt-2 md:mt-0">
          
          {/* Wallet Connect */}
          <div>
            {mounted && (
              <WalletMultiButton className="!bg-transparent !border !border-white/20 hover:!bg-white/5 !rounded-full !h-10 !px-4 !font-mono !text-xs" />
            )}
          </div>

          {/* Buy Button */}
          <a 
            href="https://pump.fun/coin/5kkYSNkWgn6DCkTkPRbKKEZtmzVzVWXSR9R9PK5Ppump" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-brand-purple hover:bg-[#9b5cd6] transition-colors text-white font-bold font-mono text-xs px-5 py-2.5 rounded-full flex items-center gap-1.5 shadow-[0_0_15px_rgba(177,108,234,0.4)] whitespace-nowrap"
          >
            Buy $SSDY ↗
          </a>

        </div>

      </div>
    </motion.header>
  );
};