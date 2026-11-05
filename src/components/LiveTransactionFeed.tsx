"use client";
import { useState, useEffect } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { Activity } from "lucide-react";

// 🚨 COPY THE WEBSOCKET URL FROM YOUR HELIUS DASHBOARD (Starts with wss://)
const HELIUS_WS_URL = "wss://mainnet.helius-rpc.com/?api-key=962ba1d4-9320-4a6d-b1e5-da3487e467d5";

// Use the standard RPC for fetching history
const HELIUS_RPC_URL = "https://mainnet.helius-rpc.com/?api-key=962ba1d4-9320-4a6d-b1e5-da3487e467d5";

const connection = new Connection(HELIUS_RPC_URL, {
  wsEndpoint: HELIUS_WS_URL,
  commitment: "confirmed",
});

// 🚨 IF YOU SWITCHED TO THE METEORA TOKEN, CHANGE THIS ADDRESS
const TOKEN_MINT = new PublicKey("5kkYSNkWgn6DCkTkPRbKKEZtmzVzVWXSR9R9PK5Ppump");

export const LiveTransactionFeed = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. FETCH RECENT TRANSACTIONS ON LOAD (So it's not blank)
    const fetchRecent = async () => {
      try {
        const signatures = await connection.getSignaturesForAddress(TOKEN_MINT, { limit: 5 });
        
        const recentTxs = signatures.map(sig => ({
          id: sig.signature,
          time: sig.blockTime ? new Date(sig.blockTime * 1000).toLocaleTimeString() : "Unknown",
          wallet: sig.signature.slice(0, 4) + "..." + sig.signature.slice(-4),
          status: sig.err ? "FAILED" : "CONFIRMED"
        }));
        
        setTransactions(recentTxs);
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };

    fetchRecent();

    // 2. LISTEN FOR NEW TRANSACTIONS VIA WEBSOCKET
    let subscriptionId: number | null = null;
    
    try {
      subscriptionId = connection.onLogs(
        TOKEN_MINT,
        (logInfo) => {
          const { signature, err } = logInfo;
          if (err) return;

          setTransactions((prev) => [
            {
              id: signature,
              time: new Date().toLocaleTimeString(),
              wallet: signature.slice(0, 4) + "..." + signature.slice(-4),
              status: "CONFIRMED",
            },
            ...prev.slice(0, 9) // Keep only latest 10
          ]);
          setError(null);
        },
        "confirmed"
      );
    } catch (err: any) {
      console.error("WebSocket Error:", err);
      setError("WebSocket disconnected. Retrying...");
    }

    return () => {
      if (subscriptionId !== null && connection) {
        connection.removeOnLogsListener(subscriptionId).catch(e => console.error(e));
      }
    };
  }, []);

  return (
    <div className="w-full bg-[#0a0a0f]/80 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[300px]">
      <div className="bg-white/5 border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-brand-cyan animate-pulse" />
          <span className="font-mono text-xs text-white font-bold tracking-widest">LIVE ON-CHAIN FEED</span>
        </div>
        <span className={`font-mono text-[10px] flex items-center gap-1 ${error ? 'text-yellow-400' : 'text-green-400'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${error ? 'bg-yellow-400' : 'bg-green-400 animate-ping'}`} /> 
          {error ? 'RECONNECTING' : 'WEBSOCKET'}
        </span>
      </div>

      <div className="flex-1 p-4 overflow-y-auto font-mono text-xs flex flex-col gap-3">
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center mt-10 animate-pulse">Scanning blockchain for recent activity...</p>
        ) : (
          transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="flex items-center gap-3">
                <span className={`font-bold ${tx.status === 'CONFIRMED' ? 'text-green-400' : 'text-red-400'}`}>
                  [{tx.status}]
                </span>
                <span className="text-gray-300">Hash: {tx.wallet}</span>
              </div>
              <span className="text-gray-500">{tx.time}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};