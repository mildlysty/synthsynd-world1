"use client";

import { useState, useEffect, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Header } from "@/components/Header";
import { GridBackground } from "@/components/GridBackground";
import { AgentCard } from "@/components/AgentCard";
import { supabase } from "@/lib/supabaseClient";
import { 
  Wallet, Box, User, Copy, Check, Link as LinkIcon, 
  Save, LayoutDashboard, Image as ImageIcon, Users, 
  Coins, Sparkles, Loader2, Flame, Zap 
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function ProfilePage() {
  const { publicKey } = useWallet();
  
  // Data State
  const [myItems, setMyItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  
  // Profile State
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastClaimed, setLastClaimed] = useState<string | null>(null);
  
  // Action States
  const [saving, setSaving] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Referral State
  const [referralCount, setReferralCount] = useState(0);
  const [referralEarnings, setReferralEarnings] = useState(0);

  const [activeTab, setActiveTab] = useState<"dashboard" | "referral" | "edit-profile">("dashboard");
  const referralLink = `https://synthsyndworld.fun/?ref=${publicKey?.toBase58()}`;

  // 🚨 THE FIX: Fetching logic and State Resetting
  useEffect(() => {
    const fetchData = async () => {
      // 1. RESET ALL STATE when a new wallet connects
      setUsername("");
      setAvatarUrl("");
      setXp(0);
      setStreak(0);
      setLastClaimed(null);
      setMyItems([]);
      setReferralEarnings(0);
      
      if (!publicKey) {
        setLoading(false);
        return;
      }

      setLoading(true);

      // 2. Fetch Profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("wallet_address", publicKey.toBase58())
        .single();

      if (profileData) {
        // User exists
        setUsername(profileData.username || "");
        setAvatarUrl(profileData.avatar_url || "");
        setXp(profileData.xp || 0);
        setStreak(profileData.current_streak || 0);
        setLastClaimed(profileData.last_claimed_at);
        setReferralEarnings(profileData.referral_earnings || 0);
        setActiveTab("dashboard"); // Default to dashboard
      } else {
        // 🚨 NEW USER: Force them to the Edit Profile tab to set a name
        setActiveTab("edit-profile");
      }

      // 3. Fetch User's Published Items
      const { data: itemsData } = await supabase
        .from("agents")
        .select("*")
        .eq("creator_wallet", publicKey.toBase58())
        .order("created_at", { ascending: false });
      
      if (itemsData) setMyItems(itemsData);
      setLoading(false);
    };
    fetchData();
  }, [publicKey]);

  // 🚨 DAILY STREAK CLAIM
  const handleClaimDaily = async () => {
    if (!publicKey) return;
    if (!username) return toast.error("Please set a username first!");
    
    setClaiming(true);

    const { data, error } = await supabase.rpc('claim_daily_xp', { user_wallet: publicKey.toBase58() });

    if (error || !data.success) {
      toast.error(error?.message || data?.message || "Failed to claim.");
    } else {
      setXp(prev => prev + data.reward);
      setStreak(data.streak);
      setLastClaimed(new Date().toISOString());
      toast.success(`+${data.reward} XP Claimed!`, {
        description: "Your daily streak has been updated.",
      });
    }
    setClaiming(false);
  };

  // 🚨 IMAGE UPLOAD
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadingImage(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${publicKey?.toBase58()}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      setAvatarUrl(data.publicUrl);
      
      toast.success("Image uploaded!", { description: "Don't forget to save your profile." });

    } catch (error: any) {
      toast.error(`Upload Failed: ${error.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  // 🚨 SAVE PROFILE (With Unique Username Check)
  const handleSaveProfile = async () => {
    if (!publicKey) return toast.error("Wallet not connected.");
    if (!username.trim()) return toast.error("Username cannot be empty.");
    
    setSaving(true);
    
    // 1. Check if username is already taken by someone else
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("wallet_address")
      .eq("username", username.trim())
      .single();

    if (existingUser && existingUser.wallet_address !== publicKey.toBase58()) {
      toast.error("Username is already taken by another creator!");
      setSaving(false);
      return;
    }

    // 2. Save the profile
    const { error } = await supabase.from("profiles").upsert({
      wallet_address: publicKey.toBase58(),
      username: username.trim(),
      avatar_url: avatarUrl, 
    });

    if (error) {
      console.error("Database Error:", error);
      toast.error(`Failed to save: ${error.message}`);
      setSaving(false);
      return;
    }
    
    setSaving(false);
    toast.success("Profile Saved Successfully!", {
      description: "Your changes are now live on the marketplace.",
    });
    
    // Switch to dashboard after saving
    setActiveTab("dashboard");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral Link Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const hasClaimedToday = lastClaimed && new Date(lastClaimed).toDateString() === new Date().toDateString();

  if (!publicKey) {
    return (
      <main className="min-h-screen bg-brand-dark pt-40 px-6 flex flex-col items-center">
        <Header />
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <Wallet className="w-12 h-12 text-gray-500" />
        </div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">Connect Wallet</h1>
        <p className="font-mono text-gray-400">Connect to access your Creator Dashboard.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden bg-brand-dark pt-40 pb-32 px-6">
      <GridBackground />
      <Header />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 border-b border-white/10 pb-10 mb-10">
          
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#0a0a0f] border-2 border-brand-cyan/30 flex items-center justify-center shadow-[0_0_40px_rgba(42,245,210,0.15)] overflow-hidden relative group">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-16 h-16 text-gray-500" />
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-brand-cyan text-black p-1.5 rounded-full border-4 border-[#050505]">
              <Sparkles className="w-4 h-4" />
            </div>
          </motion.div>

          <div className="flex-1 text-center md:text-left">
            <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-4xl md:text-5xl font-display font-bold text-white mb-3 flex flex-col md:flex-row items-center justify-center md:justify-start gap-3">
              {username || "Anonymous Creator"} 
              <span className="text-brand-cyan text-xs md:text-sm font-mono bg-brand-cyan/10 px-3 py-1 rounded-full border border-brand-cyan/20 tracking-wider">
                XP: {xp}
              </span>
            </motion.h1>
            <p className="font-mono text-sm text-gray-400 bg-black/40 px-4 py-1.5 rounded-lg border border-white/5 inline-block mb-6">
              {publicKey.toBase58()}
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-3">
                <Box className="w-4 h-4 text-brand-purple" />
                <span className="font-mono text-xs text-gray-300">{myItems.length} Items Published</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-3">
                <Users className="w-4 h-4 text-green-400" />
                <span className="font-mono text-xs text-gray-300">{referralCount} Referrals</span>
              </div>
            </div>
          </div>
        </div>

        {/* DASHBOARD TABS */}
        <div className="flex flex-wrap gap-2 mb-8 bg-black/40 p-1.5 rounded-2xl w-fit border border-white/5">
          <button onClick={() => setActiveTab("dashboard")} className={`px-6 py-3 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all ${activeTab === "dashboard" ? "bg-white text-black shadow-lg" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
            <LayoutDashboard className="w-4 h-4" /> My Studio
          </button>
          <button onClick={() => setActiveTab("referral")} className={`px-6 py-3 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all ${activeTab === "referral" ? "bg-white text-black shadow-lg" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
            <LinkIcon className="w-4 h-4" /> Referrals
          </button>
          <button onClick={() => setActiveTab("edit-profile")} className={`px-6 py-3 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all ${activeTab === "edit-profile" ? "bg-white text-black shadow-lg" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
            <User className="w-4 h-4" /> Edit Profile
          </button>
        </div>

        {/* TAB CONTENT */}
        <div className="min-h-[400px]">
          
          {/* DASHBOARD (REWARDS) TAB */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* DAILY STREAK CARD */}
              <div className="bg-gradient-to-r from-brand-cyan/10 via-transparent to-brand-purple/10 border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] pointer-events-none" />
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-orange-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.2)]">
                      <Flame className="w-10 h-10 text-orange-500 animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-display font-bold text-white mb-2">Daily Check-in</h2>
                      <p className="font-mono text-sm text-gray-400">Maintain your streak to earn massive XP bonuses.</p>
                    </div>
                  </div>

                  <div className="text-center md:text-right">
                    <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-1">Current Streak</p>
                    <p className="text-5xl font-display font-bold text-orange-400">{streak} <span className="text-2xl text-gray-500">Days</span></p>
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 relative z-10 border-t border-white/10 pt-6">
                  <button 
                    onClick={handleClaimDaily}
                    disabled={hasClaimedToday || claiming || !username}
                    className={`w-full sm:w-auto px-10 py-4 font-bold font-mono text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg
                      ${hasClaimedToday || !username ? 'bg-white/5 text-gray-500 border border-white/10 cursor-not-allowed' : 'bg-brand-cyan text-black hover:bg-[#20d4b6]'}
                    `}
                  >
                    {claiming ? <Loader2 className="w-4 h-4 animate-spin" /> : hasClaimedToday ? <Check className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                    {claiming ? "CLAIMING..." : !username ? "SET USERNAME FIRST" : hasClaimedToday ? "ALREADY CLAIMED TODAY" : "CLAIM DAILY XP"}
                  </button>
                </div>
              </div>

              {/* User's Creations Grid */}
              <div>
                <h3 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-2">
                  <Box className="w-6 h-6 text-brand-purple" /> My Creations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {loading ? (
                    <p className="text-gray-500 font-mono text-sm animate-pulse">Loading items...</p>
                  ) : myItems.length === 0 ? (
                    <div className="col-span-3 text-center py-20 border border-white/10 border-dashed rounded-xl bg-white/5">
                      <Box className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 font-mono text-sm mb-4">You haven't published anything yet.</p>
                      <button onClick={() => window.location.href = '/#agents'} className="px-6 py-2 bg-brand-cyan text-black font-bold font-mono text-xs rounded-lg hover:bg-[#20d4b6]">
                        PUBLISH NOW
                      </button>
                    </div>
                  ) : (
                    myItems.map(item => <AgentCard key={item.id} agent={item} />)
                  )}
                </div>
              </div>

            </div>
          )}

          {/* REFERRAL TAB */}
          {activeTab === "referral" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-gradient-to-br from-[#0a0a0f] to-[#12121a] border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-cyan/5 rounded-full blur-[100px] pointer-events-none" />
                
                <div className="max-w-3xl relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-brand-cyan/20 rounded-xl">
                      <LinkIcon className="w-6 h-6 text-brand-cyan" />
                    </div>
                    <h2 className="text-3xl font-display font-bold text-white">Welcome to the Syndicate!</h2>
                  </div>
                  
                  <p className="font-mono text-sm text-gray-400 mb-8 leading-relaxed max-w-xl">
                    Invite other creators to Synthsynd World. When they use your link to launch an agent, you earn a <strong className="text-brand-cyan">5% commission</strong> of the protocol fee, sent directly to your wallet.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="bg-black/50 border border-white/5 rounded-2xl p-6 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-green-400" />
                        <p className="font-mono text-xs text-gray-500 uppercase tracking-wider">Total Referrals</p>
                      </div>
                      <p className="text-4xl font-display font-bold text-white">{referralCount}</p>
                    </div>
                    
                    <div className="bg-black/50 border border-white/5 rounded-2xl p-6 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-2">
                        <Coins className="w-4 h-4 text-yellow-400" />
                        <p className="font-mono text-xs text-gray-500 uppercase tracking-wider">Earned from Referrals</p>
                      </div>
                      <p className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-white">
                        {referralEarnings.toFixed(2)} SOL
                      </p>
                    </div>
                  </div>

                  <div className="bg-black/60 border border-white/10 rounded-2xl p-2 flex flex-col sm:flex-row items-center gap-2">
                    <input type="text" readOnly value={referralLink} className="bg-transparent text-brand-cyan font-mono text-sm outline-none px-4 w-full" />
                    <button onClick={copyReferral} className="w-full sm:w-auto px-6 py-3 bg-brand-cyan text-black rounded-xl hover:bg-[#20d4b6] transition-colors flex items-center justify-center gap-2 font-mono text-xs font-bold shrink-0">
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? "COPIED" : "COPY LINK"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* EDIT PROFILE TAB */}
          {activeTab === "edit-profile" && (
            <div className="bg-[#0a0a0f] border border-white/10 rounded-3xl p-8 md:p-12 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-display font-bold text-white mb-8">Edit Profile</h2>
              
              <div className="space-y-8">
                
                {/* File Upload UI */}
                <div>
                  <label className="block font-mono text-xs text-gray-500 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> Profile Picture
                  </label>
                  <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                    <div className="w-24 h-24 rounded-full bg-black border-2 border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                      {avatarUrl ? <img src={avatarUrl} className="w-full h-full object-cover" /> : <User className="w-10 h-10 text-gray-500" />}
                    </div>
                    <div className="flex-1">
                      <input 
                        type="file" 
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        className="hidden" 
                      />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="px-6 py-3 bg-white/10 border border-white/20 text-white font-mono text-sm rounded-xl hover:bg-white/20 transition-colors flex items-center gap-2"
                      >
                        {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                        {uploadingImage ? "UPLOADING..." : "UPLOAD FROM DEVICE"}
                      </button>
                      <p className="text-[10px] font-mono text-gray-500 mt-2">Max size: 2MB. Formats: JPG, PNG, GIF.</p>
                    </div>
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label className="block font-mono text-xs text-gray-500 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <User className="w-4 h-4" /> Unique Username
                  </label>
                  <input 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value.replace(/\s+/g, ''))} 
                    placeholder="e.g. Satoshi_Dev" 
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:border-brand-cyan outline-none transition-colors"
                  />
                  <p className="text-[10px] font-mono text-gray-500 mt-2">This is how you will appear on the marketplace. Must be unique.</p>
                </div>
                
                {/* SAVE BUTTON */}
                <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center gap-4">
                  <button 
                    onClick={handleSaveProfile} 
                    disabled={saving} 
                    className="w-full sm:w-auto px-10 py-4 font-bold font-mono text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg bg-brand-cyan text-black hover:bg-[#20d4b6]"
                  >
                    {saving ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> SAVING...</>
                    ) : (
                      <><Save className="w-4 h-4" /> SAVE PROFILE</>
                    )}
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}