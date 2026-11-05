"use client";
import { useState, useEffect } from "react";
import { TrendingUp, Activity, ArrowUpRight, Droplets } from "lucide-react";

const TOKEN_ADDRESS = "5kkYSNkWgn6DCkTkPRbKKEZtmzVzVWXSR9R9PK5Ppump";

export const RealTimeMarketStats = () => {
  const [stats, setStats] = useState({ price: "0.00", volume: "0", mcap: "0", liquidity: "0" });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${TOKEN_ADDRESS}`, {
        cache: "no-store",
      });
      const data = await res.json();
      
      if (data.pairs && data.pairs.length > 0) {
        const pair = data.pairs[0]; 
        setStats({
          price: parseFloat(pair.priceUsd || 0).toFixed(8),
          volume: pair.volume?.h24 ? (pair.volume.h24 / 1000).toFixed(1) + "K" : "0",
          mcap: pair.fdv ? (pair.fdv / 1000).toFixed(1) + "K" : "0",
          liquidity: pair.liquidity?.usd ? (pair.liquidity.usd / 1000).toFixed(1) + "K" : "0",
        });
      } else {
        console.log("Token not indexed on DexScreener yet.");
      }
    } catch (error) {
      console.error("DexScreener API error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 15000); // Fetch every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const statItems = [
    { label: "Price", value: `$${stats.price}`, icon: <TrendingUp className="w-4 h-4 text-brand-cyan" /> },
    { label: "24h Volume", value: `$${stats.volume}`, icon: <Activity className="w-4 h-4 text-brand-purple" /> },
    { label: "Market Cap", value: `$${stats.mcap}`, icon: <ArrowUpRight className="w-4 h-4 text-green-400" /> },
    { label: "Liquidity", value: `$${stats.liquidity}`, icon: <Droplets className="w-4 h-4 text-blue-400" /> },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
      {statItems.map((stat) => (
        <div key={stat.label} className="bg-brand-card/40 backdrop-blur-md border border-white/10 rounded-xl p-4">
          <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-2">
            {stat.icon} {stat.label}
          </p>
          <p className="font-mono font-bold text-lg text-white">
            {loading ? <span className="animate-pulse bg-white/20 text-transparent rounded">$0.00</span> : stat.value}
          </p>
        </div>
      ))}
    </div>
  );
};