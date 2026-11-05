"use client";
import { motion } from "framer-motion";

export const TickerTape = () => {
  return (
    <div className="fixed top-0 left-0 w-full bg-[#0a0a0f] border-b border-white/10 z-[60] overflow-hidden py-1">
      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        className="flex whitespace-nowrap gap-8 text-xs font-mono"
      >
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-gray-400">$SSDY</span>
            <span className="text-green-400">+12.4%</span>
            <span className="text-brand-cyan">$0.00000913</span>
            <span className="text-gray-600">|</span>
            <span className="text-gray-400">$SOL</span>
            <span className="text-green-400">+5.2%</span>
            <span className="text-brand-cyan">$142.50</span>
            <span className="text-gray-600">|</span>
            <span className="text-gray-400">NETWORK</span>
            <span className="text-brand-purple">LIVE</span>
            <span className="text-gray-600">|</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};