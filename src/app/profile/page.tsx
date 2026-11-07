"use client";

import React, { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { createClient } from "@supabase/supabase-js";
import { User, Loader2 } from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ProfilePage() {
  const { publicKey, connected } = useWallet();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [newUsername, setNewUsername] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!connected || !publicKey) {
        setIsLoading(false);
        setProfile(null);
        return;
      }

      const walletAddress = publicKey.toBase58();
      setIsLoading(true);

      // 1. Fetch the specific user matching the CONNECTED wallet
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("wallet_address", walletAddress)
        .single(); // .single() expects exactly one result

      if (error || !data) {
        // If no user is found, they are a new user!
        setNeedsSetup(true);
        setProfile({ wallet_address: walletAddress, xp: 0, streak: 0 });
      } else {
        // User found!
        setProfile(data);
        setNeedsSetup(false);
      }
      setIsLoading(false);
    };

    fetchProfile();
  }, [connected, publicKey]); // <--- THIS IS THE KEY: It re-runs when wallet changes

  // Function to save new username to database
  const handleCreateProfile = async () => {
    if (!newUsername || !publicKey) return;
    
    const walletAddress = publicKey.toBase58();
    
    const { error } = await supabase.from("users").insert([
      {
        wallet_address: walletAddress,
        username: newUsername,
        xp: 0,
        streak: 0,
      },
    ]);

    if (error) {
      alert("Error creating profile: " + error.message);
    } else {
      // Refresh the page to load the new profile
      window.location.reload();
    }
  };

  if (!connected) {
    return <div className="text-white text-center py-20">Please connect your wallet to view your profile.</div>;
  }

  if (isLoading) {
    return <div className="text-white text-center py-20 flex items-center justify-center gap-2"><Loader2 className="animate-spin" /> Loading Profile...</div>;
  }

  // UI for new users who don't have a username yet
  if (needsSetup) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-[#0a0a0a] border border-white/10 rounded-2xl">
        <h2 className="text-2xl font-bold text-white mb-4">Welcome to Synthsynd!</h2>
        <p className="text-gray-400 mb-6">Set a username to join the leaderboard and start earning XP.</p>
        <input
          type="text"
          placeholder="Enter username"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white mb-4 outline-none focus:border-purple-500"
        />
        <button
          onClick={handleCreateProfile}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all"
        >
          Create Profile
        </button>
      </div>
    );
  }

  // UI for existing users (Your existing code goes here)
  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-4xl font-bold text-white mb-4">{profile.username}</h1>
      <p className="text-gray-400 font-mono text-sm mb-4">{profile.wallet_address}</p>
      
      {/* ... The rest of your beautiful profile UI (XP, streak, etc.) ... */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 mt-8">
         <h2 className="text-white font-bold text-xl">XP: {profile.xp}</h2>
         <h2 className="text-white font-bold text-xl mt-2">Streak: {profile.streak} Days</h2>
      </div>
    </div>
  );
}