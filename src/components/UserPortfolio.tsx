"use client";
import { useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { Wallet, ArrowUpRight, ShieldCheck, Zap } from "lucide-react";

const TOKEN_MINT = new PublicKey("5kkYSNkWgn6DCkTkPRbKKEZtmzVzVWXSR9R9PK5Ppump");

export const UserPortfolio = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!publicKey) return;
      setIsLoading(true);
      try {
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, { mint: TOKEN_MINT });
        if (tokenAccounts.value.length > 0) {
          const amount = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
          setBalance(amount);
        } else {
          setBalance(0);
        }
      } catch (error) {
        console.error("Failed to fetch balance:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBalance();
  }, [publicKey, connection]);

  if (!publicKey) {
    return (
      <div className="bg-brand-card/40 border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center h-full min-h-[220px]">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
          <Wallet className="w-8 h-8 text-brand-cyan" />
        </div>
        <h3 className="font-display font-bold text-xl text-white mb-2">Connect Wallet</h3>
        <p className="font-mono text-xs text-gray-400 max-w-sm mb-6">
          Connect your Phantom or Solflare wallet to view your $SSDY portfolio.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-brand-card/40 backdrop-blur-md border border-brand-cyan/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(42,245,210,0.05)] relative overflow-hidden h-full min-h-[220px] flex flex-col justify-between">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cyan/10 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-green-400" /> Connected Wallet
          </p>
          <p className="font-mono text-sm text-white bg-black/40 px-3 py-1 rounded-md border border-white/5 inline-block">
            {publicKey.toBase58().slice(0, 6)}...{publicKey.toBase58().slice(-4)}
          </p>
        </div>
        <a href={`https://solscan.io/account/${publicKey.toBase58()}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10">
          <ArrowUpRight className="w-4 h-4 text-gray-400 hover:text-white" />
        </a>
      </div>

      <div className="space-y-1 relative z-10">
        <p className="font-mono text-xs text-gray-400">Your $SSDY Balance</p>
        <div className="flex flex-wrap items-baseline gap-2">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white break-all">
            {isLoading ? (
              <span className="animate-pulse bg-white/20 text-transparent rounded">0.00</span>
            ) : (
              balance !== null ? balance.toLocaleString() : "0"
            )}
          </h2>
          <span className="font-mono text-brand-cyan font-bold text-lg">$SSDY</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6 relative z-10 border-t border-white/10 pt-4">
         <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="font-mono text-[10px] text-gray-300">Status: Active</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="font-mono text-[10px] text-gray-300">Network: Solana</span>
         </div>
      </div>
    </div>
  );
};