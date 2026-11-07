import { Gift, Twitter, Heart, Repeat, CheckCircle2, Lock, ExternalLink } from "lucide-react";

export default function AirdropQuests({ currentXp }: { currentXp: number }) {
  const GOAL_XP = 5000;
  const isQualified = currentXp >= GOAL_XP;
  const progressPercentage = Math.min((currentXp / GOAL_XP) * 100, 100);

  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 w-full max-w-lg relative overflow-hidden flex flex-col gap-6">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 blur-3xl rounded-full"></div>

      {/* Airdrop Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Gift className="text-purple-400 w-6 h-6" />
          <h2 className="text-white font-bold text-xl">Season 1 Airdrop</h2>
        </div>
        <p className="text-gray-400 text-sm">Reach 5,000 XP to guarantee your $SSDY allocation.</p>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Your Progress</span>
          <span className="text-white font-bold">{currentXp.toLocaleString()} / 5,000 XP</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isQualified ? "bg-green-500" : "bg-gradient-to-r from-purple-500 to-cyan-400"
            }`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Status Box */}
      {isQualified ? (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle2 className="text-green-400 w-6 h-6 flex-shrink-0" />
          <div>
            <p className="text-green-400 font-bold text-sm">Guaranteed Airdrop Unlocked!</p>
            <p className="text-gray-400 text-xs mt-1">You qualify for the $SSDY distribution at the end of the season.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
          <Lock className="text-gray-400 w-5 h-5 flex-shrink-0" />
          <p className="text-gray-400 text-sm">
            Earn <strong className="text-white">{(5000 - currentXp).toLocaleString()} more XP</strong> to unlock your guaranteed allocation.
          </p>
        </div>
      )}

      {/* Bonus Quests Section */}
      <div className="mt-2">
        <h3 className="text-white font-bold text-sm mb-3 uppercase tracking-wider text-gray-400">Bonus XP Quests</h3>
        
        <div className="space-y-3">
          {/* Quest 1: Follow */}
          <div className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-lg hover:border-white/20 transition-colors">
            <div className="flex items-center gap-3">
              <Twitter className="text-blue-400 w-5 h-5" />
              <div>
                <p className="text-white text-sm font-medium">Follow us on X</p>
                <p className="text-gray-500 text-xs">+250 XP</p>
              </div>
            </div>
            <a 
              href="https://twitter.com/intent/follow?screen_name=YourHandle" // Replace with your actual handle
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1"
            >
              Follow <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Quest 2: Like & RT */}
          <div className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-lg hover:border-white/20 transition-colors">
            <div className="flex items-center gap-3">
              <Heart className="text-pink-500 w-5 h-5" />
              <div>
                <p className="text-white text-sm font-medium">Like & Retweet Pinned Post</p>
                <p className="text-gray-500 text-xs">+250 XP</p>
              </div>
            </div>
            <a 
              href="https://twitter.com/YourHandle" // Replace with link to your pinned post
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-pink-500/20 text-pink-400 hover:bg-pink-500 hover:text-white px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1"
            >
              Go to Post <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Quest 3: Post about us */}
          <div className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-lg hover:border-white/20 transition-colors">
            <div className="flex items-center gap-3">
              <Repeat className="text-purple-400 w-5 h-5" />
              <div>
                <p className="text-white text-sm font-medium">Post about Synthsynd</p>
                <p className="text-gray-500 text-xs">+500 XP (Manual Verify)</p>
              </div>
            </div>
            <button className="bg-purple-500/20 text-purple-400 hover:bg-purple-500 hover:text-white px-3 py-1.5 rounded-md text-xs font-bold transition-all">
              Submit Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}