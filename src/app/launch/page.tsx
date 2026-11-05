"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { GridBackground } from "@/components/GridBackground";
import { supabase } from "@/lib/supabaseClient";
import { ArrowRight, Terminal, Shield, Cpu, CheckCircle, Wallet } from "lucide-react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import { 
  getAssociatedTokenAddress, 
  createTransferInstruction, 
  createAssociatedTokenAccountInstruction 
} from "@solana/spl-token";

const TOKEN_MINT = new PublicKey("5kkYSNkWgn6DCkTkPRbKKEZtmzVzVWXSR9R9PK5Ppump");
const LAUNCH_FEE = 1000; // 1,000 $SSDY launch fee

export default function Launchpad() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  
  const [step, setStep] = useState(1);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    ticker: "",
    liquidity: "10.0"
  });

  const nextStep = async () => {
    if (step === 3) {
      if (!publicKey) {
        setErrorMsg("Please connect your wallet first.");
        return;
      }

      const treasuryAddress = process.env.NEXT_PUBLIC_TREASURY_WALLET;
      if (!treasuryAddress) {
        setErrorMsg("Treasury wallet address is missing in .env.local");
        return;
      }

      setIsDeploying(true);
      setErrorMsg("");

      try {
        const treasuryWallet = new PublicKey(treasuryAddress);

        // 1. Get Token Accounts
        const fromTokenAccount = await getAssociatedTokenAddress(TOKEN_MINT, publicKey);
        const toTokenAccount = await getAssociatedTokenAddress(TOKEN_MINT, treasuryWallet);
        
        // Standard pump.fun tokens have 6 decimals
        const amountToSend = LAUNCH_FEE * Math.pow(10, 6);

        const transaction = new Transaction();

        // 2. Check if Treasury has a $SSDY account. If not, create it.
        const accountInfo = await connection.getAccountInfo(toTokenAccount);
        if (accountInfo === null) {
          transaction.add(
            createAssociatedTokenAccountInstruction(
              publicKey, // Payer
              toTokenAccount, // New account
              treasuryWallet, // Owner
              TOKEN_MINT // Mint
            )
          );
        }

        // 3. Add Transfer Instruction
        transaction.add(
          createTransferInstruction(
            fromTokenAccount,
            toTokenAccount,
            publicKey,
            amountToSend
          )
        );

        // 4. Send Transaction
        const signature = await sendTransaction(transaction, connection);
        
        // Wait for confirmation
        await connection.confirmTransaction(signature, "confirmed");

        // 5. Save to Database only after payment succeeds
        const { error } = await supabase.from("agents").insert([
          {
            name: formData.name,
            description: formData.description,
            ticker: formData.ticker,
            creator_wallet: publicKey.toBase58(),
          }
        ]);

        if (error) throw error;
        setIsSuccess(true);
      } catch (err: any) {
        console.error("Transaction Error:", err);
        setErrorMsg("Transaction failed. Ensure you have enough $SSDY and a small amount of SOL for network fees.");
      } finally {
        setIsDeploying(false);
      }
    } else {
      setStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <main className="min-h-screen relative overflow-hidden bg-brand-dark pt-32 pb-20 px-6">
      <GridBackground />
      <Header />

      <div className="max-w-4xl mx-auto relative z-10">
        
        <div className="mb-12 border-b border-white/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="relative z-10">
            <div className="flex items-center gap-2 font-mono text-xs text-brand-cyan mb-3 bg-brand-cyan/10 w-fit px-3 py-1 rounded-full border border-brand-cyan/20">
              <Cpu className="w-4 h-4" /> SYSTEM.READY
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-bold">
              Initialize <span className="text-white/40">Agent</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 bg-brand-purple/10 border border-brand-purple/20 px-4 py-2 rounded-lg">
            <Wallet className="w-4 h-4 text-brand-purple" />
            <span className="font-mono text-xs text-brand-purple">Launch Fee: {LAUNCH_FEE.toLocaleString()} $SSDY</span>
          </div>
        </div>

        <div className="bg-[#0a0a0f]/80 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl overflow-hidden relative">
          <div className="bg-white/5 border-b border-white/10 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-gray-400" />
              <span className="font-mono text-xs text-gray-400">synthsynd_deploy.sh</span>
            </div>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
            </div>
          </div>

          <div className="p-8 md:p-12 min-h-[450px] flex flex-col justify-between relative">
            <AnimatePresence mode="wait">
              
              {step === 1 && !isSuccess && (
                <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                  <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                    <h2 className="font-mono text-sm text-brand-cyan">01. AGENT_DEFINITION</h2>
                    <Shield className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="space-y-5">
                    <div>
                      <label className="block font-mono text-[10px] text-gray-500 mb-2 uppercase tracking-widest">Agent Identifier</label>
                      <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Athena_Alpha_01" className="w-full bg-black/50 border border-white/10 rounded-md px-4 py-3 text-white focus:outline-none focus:border-brand-cyan font-mono text-sm" suppressHydrationWarning autoComplete="off" />
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] text-gray-500 mb-2 uppercase tracking-widest">Execution Directive (Prompt)</label>
                      <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe the core logic and purpose of this agent..." rows={4} className="w-full bg-black/50 border border-white/10 rounded-md px-4 py-3 text-white focus:outline-none focus:border-brand-cyan font-mono text-sm resize-none" suppressHydrationWarning />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && !isSuccess && (
                <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                  <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                    <h2 className="font-mono text-sm text-brand-purple">02. TOKEN_PARAMETERS</h2>
                    <Shield className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="space-y-5">
                    <div>
                      <label className="block font-mono text-[10px] text-gray-500 mb-2 uppercase tracking-widest">Ticker Symbol</label>
                      <input type="text" value={formData.ticker} onChange={(e) => setFormData({ ...formData, ticker: e.target.value })} placeholder="e.g. $ATH" className="w-full bg-black/50 border border-white/10 rounded-md px-4 py-3 text-white focus:outline-none focus:border-brand-purple font-mono text-sm" suppressHydrationWarning autoComplete="off" />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && !isSuccess && (
                <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-center space-y-6 py-8">
                  <div className="w-16 h-16 mx-auto bg-brand-cyan/10 border border-brand-cyan/30 rounded-lg flex items-center justify-center mb-6">
                    <Terminal className="w-8 h-8 text-brand-cyan" />
                  </div>
                  <h2 className="text-xl font-mono text-white">SYSTEM_READY_TO_DEPLOY</h2>
                  <p className="font-mono text-xs text-gray-400 max-w-sm mx-auto">
                    Clicking execute will prompt your wallet to sign a transaction for the <strong>{LAUNCH_FEE.toLocaleString()} $SSDY</strong> launch fee.
                  </p>
                  {errorMsg && (
                     <div className="bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-xs p-3 rounded-lg max-w-sm mx-auto">
                       {errorMsg}
                     </div>
                  )}
                </motion.div>
              )}

              {isSuccess && (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6 py-8">
                  <div className="w-20 h-20 mx-auto bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-green-400" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-white">Agent Deployed Successfully!</h2>
                  <p className="font-mono text-sm text-gray-400 max-w-sm mx-auto">
                    Transaction confirmed on Solana. Your agent is now live in the database.
                  </p>
                  <a href="/#agents" className="inline-block mt-4 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-mono text-sm rounded-lg transition-colors">
                    VIEW IN MARKETPLACE
                  </a>
                </motion.div>
              )}
            </AnimatePresence>

            {!isSuccess && (
              <div className="flex justify-between items-center mt-10 pt-6 border-t border-white/5">
                <button onClick={prevStep} disabled={step === 1 || isDeploying} className={`font-mono text-xs px-4 py-2 transition-all ${step === 1 || isDeploying ? 'opacity-0' : 'text-gray-500 hover:text-white'}`} suppressHydrationWarning>
                  [ CANCEL ]
                </button>
                <button onClick={nextStep} disabled={isDeploying} className={`flex items-center gap-2 px-6 py-3 font-mono text-sm transition-all rounded-md ${isDeploying ? 'bg-brand-cyan/50 text-black cursor-wait' : 'bg-brand-cyan/10 border border-brand-cyan/50 text-brand-cyan hover:bg-brand-cyan hover:text-black'}`} suppressHydrationWarning>
                  {isDeploying ? "SIGNING TRANSACTION..." : step === 3 ? "PAY & DEPLOY" : "CONTINUE"}
                  {!isDeploying && step !== 3 && <ArrowRight size={16} />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}