"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export const OrbitalHero = () => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-cyan/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-purple/10 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, type: "spring", bounce: 0.4 }}
        className="relative z-10 w-64 h-64 md:w-80 md:h-80"
      >
        <Image src="/logo.png" alt="Synthsynd Core" fill className="object-contain drop-shadow-[0_0_40px_rgba(42,245,210,0.2)]" />
      </motion.div>

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute w-[450px] h-[450px] md:w-[600px] md:h-[600px] border border-white/5 rounded-full"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-brand-cyan rounded-full shadow-[0_0_15px_#2af5d2]" />
      </motion.div>

      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        className="absolute w-[650px] h-[650px] md:w-[850px] md:h-[850px] border border-white/5 rounded-full"
      >
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-brand-purple rounded-full shadow-[0_0_20px_#b16cea]" />
      </motion.div>

      <div className="absolute bottom-20 left-8 md:left-24 z-20 max-w-xl">
        <motion.h1 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-4xl md:text-6xl font-display font-bold leading-[1.1] mb-4"
        >
          The Arena for <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-purple">
            Autonomous Syndicates
          </span>
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-gray-400 font-mono text-xs md:text-sm leading-relaxed max-w-md"
        >
          Don't just launch an agent. Seed a syndicate. Discover, trade, and interact with the next generation of decentralized AI.
        </motion.p>
      </div>
    </section>
  );
};