"use client";
import { useState, useRef, useEffect } from "react";
import { Terminal, Send, Loader2, Lock, Zap, RefreshCw } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Connection } from "@solana/web3.js";

// 🚨 IF YOU SWITCHED TO THE METEORA TOKEN, CHANGE THIS ADDRESS
const TOKEN_MINT = new PublicKey("5kkYSNkWgn6DCkTkPRbKKEZtmzVzVWXSR9R9PK5Ppump");
const MIN_BALANCE = 10000; 

// 🚨 HARDCODED HELIUS RPC FOR BALANCE CHECK TO BYPASS .ENV ISSUES
// Replace 'YOUR_ACTUAL_HELIUS_API_KEY' with your real key
const TEST_HELIUS_URL = "https://mainnet.helius-rpc.com/?api-key=962ba1d4-9320-4a6d-b1e5-da3487e467d5";

export const AgentTerminal = ({ agentName, agentPrompt }: { agentName: string, agentPrompt: string }) => {
  const { publicKey } = useWallet();
  
  const [balance, setBalance] = useState<number | null>(null);
  const [checking, setChecking] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [messages, setMessages] = useState<any[]>([
    { role: "system", text: `[SYSTEM] Initializing ${agentName} v2.1...` },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const checkBalance = async () => {
    if (!publicKey) {
      setBalance(0);
      return;
    }
    
    setChecking(true);
    setErrorMsg("");
    
    try {
      const testConnection = new Connection(TEST_HELIUS_URL, "confirmed");
      
      const tokenAccounts = await testConnection.getParsedTokenAccountsByOwner(publicKey, {
        mint: TOKEN_MINT,
      });

      if (tokenAccounts.value.length > 0) {
        const amount = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
        setBalance(amount || 0);
      } else {
        setBalance(0);
      }
    } catch (error: any) {
      console.error("Balance Fetch Error:", error);
      setErrorMsg(`RPC Error: Please refresh.`);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkBalance();
  }, [publicKey]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping || !balance || balance < MIN_BALANCE) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { role: "user", text: `> ${userMessage}` }]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // 🚨 SENDING THE AGENT'S SPECIFIC NAME AND PROMPT
        body: JSON.stringify({ 
          message: userMessage,
          agentName: agentName,
          agentPrompt: agentPrompt 
        }),
      });
      const data = await res.json();
      
      // Typewriter effect
      let currentText = "";
      setMessages((prev) => [...prev, { role: "agent", text: "" }]);
      
      const replyText = data.reply || "[SYSTEM ERROR] No response.";
      
      for (let i = 0; i < replyText.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 15));
        currentText += replyText[i];
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = currentText;
          return newMessages;
        });
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: "agent", text: "[SYSTEM ERROR] Connection failed." }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (checking) {
    return (
      <div className="h-[500px] bg-[#0a0a0f]/80 border border-white/10 rounded-xl flex flex-col items-center justify-center text-brand-cyan font-mono">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p>Verifying on-chain balance...</p>
      </div>
    );
  }

  // 🚨 LOCK SCREEN UI
  if (!publicKey || !balance || balance < MIN_BALANCE) {
    return (
      <div className="w-full bg-[#0a0a0f]/80 backdrop-blur-md border border-red-500/20 rounded-xl h-[500px] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-red-500/5 blur-[100px]" />
        
        <div className="w-20 h-20 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mb-6 relative z-10">
          <Lock className="w-10 h-10 text-red-400" />
        </div>
        
        <h2 className="text-2xl font-display font-bold text-white mb-2 relative z-10">Terminal Locked</h2>
        <p className="font-mono text-sm text-gray-400 max-w-sm mb-8 relative z-10">
          You must hold at least <strong className="text-brand-cyan">{MIN_BALANCE.toLocaleString()} $SSDY</strong> to interact with this AI Agent.
        </p>
        
        {publicKey ? (
           <div className="flex flex-col items-center gap-4 relative z-10">
             <p className="font-mono text-xs text-red-400 bg-red-400/10 px-3 py-1 rounded border border-red-400/20">
               Detected Balance: {balance !== null ? balance.toLocaleString() : "0"} $SSDY
             </p>
             
             {/* DEBUG TEXT: Shows which RPC is being used */}
             <p className="font-mono text-[10px] text-gray-600 bg-black/50 px-2 py-1 rounded">
               TESTING RPC: {TEST_HELIUS_URL.split('?')[0]}
             </p>

             {errorMsg && <p className="text-red-500 text-xs font-mono">{errorMsg}</p>}

             <button onClick={checkBalance} className="text-xs font-mono text-gray-400 hover:text-white flex items-center gap-1 mb-2">
               <RefreshCw className="w-3 h-3" /> Retry Balance Check
             </button>

             <a 
               href="https://pump.fun/coin/5kkYSNkWgn6DCkTkPRbKKEZtmzVzVWXSR9R9PK5Ppump" 
               target="_blank" 
               rel="noopener noreferrer" 
               className="px-6 py-3 bg-white text-black font-bold font-mono text-sm rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
             >
               <Zap className="w-4 h-4" /> BUY $SSDY TO UNLOCK
             </a>
           </div>
        ) : (
           <p className="font-mono text-sm text-brand-cyan animate-pulse relative z-10">Connect your wallet to verify balance.</p>
        )}
      </div>
    );
  }

  // 🚨 UNLOCKED TERMINAL
  return (
    <div className="w-full bg-[#0a0a0f]/80 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden h-[500px] flex flex-col shadow-2xl relative">
      <div className="bg-white/5 border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-brand-cyan" />
          <span className="font-mono text-xs text-gray-300">{agentName.toLowerCase().replace(/\s+/g, '_')}_terminal.exe</span>
        </div>
        <span className="font-mono text-[10px] text-green-400 bg-green-400/10 px-2 py-1 rounded border border-green-400/20">
          ACCESS GRANTED • {balance.toLocaleString()} $SSDY
        </span>
      </div>

      <div className="flex-1 p-6 font-mono text-sm overflow-y-auto space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`whitespace-pre-wrap ${
            msg.role === "user" ? "text-brand-cyan" : 
            msg.role === "agent" ? "text-gray-300 bg-white/5 p-2 rounded border border-white/5" : "text-gray-500"
          }`}>
            {msg.text}
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center gap-2 text-brand-cyan">
            <Loader2 className="w-4 h-4 animate-spin" /> [AGENT] Processing neural request...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t border-white/10 bg-black/50">
        <div className="flex items-center gap-2">
          <span className="font-mono text-brand-cyan text-sm">&gt;</span>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a command for the AI agent..."
            className="flex-1 bg-transparent border-none outline-none text-white font-mono text-sm placeholder:text-gray-600"
          />
          <button onClick={handleSend} disabled={isTyping} className="p-2 bg-brand-cyan/10 text-brand-cyan rounded hover:bg-brand-cyan/20 transition-colors disabled:opacity-50">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};