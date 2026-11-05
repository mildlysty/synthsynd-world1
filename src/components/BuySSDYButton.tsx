"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export const BuySSDYButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleBuy = () => {
    window.open("https://pump.fun/coin/5kkYSNkWgn6DCkTkPRbKKEZtmzVzVWXSR9R9PK5Ppump", "_blank");
  };

  return (
    <motion.button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleBuy}
      whileTap={{ scale: 0.95 }}
      className="relative overflow-hidden group px-6 py-2.5 rounded-full font-mono text-xs md:text-sm font-bold tracking-wider text-black"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-brand-cyan to-brand-purple opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
      
      <span className="relative z-10 flex items-center gap-2">
        BUY $SSDY
        <motion.span
          animate={{ x: isHovered ? 3 : 0, y: isHovered ? -1 : 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          ↗
        </motion.span>
      </span>

      {isHovered && (
        <motion.div
          className="absolute inset-0 border-2 border-brand-cyan rounded-full"
          initial={{ opacity: 0.8, scale: 1 }}
          animate={{ opacity: 0, scale: 1.15 }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
};