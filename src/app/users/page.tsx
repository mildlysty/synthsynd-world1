    "use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Header } from "@/components/Header";
import { GridBackground } from "@/components/GridBackground";
import { Search, User, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setUsers(data);
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => 
    u.username?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen relative overflow-hidden bg-brand-dark pt-40 pb-20 px-6">
      <GridBackground />
      <Header />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Discover <span className="text-brand-cyan">Creators</span>
          </h1>
          <p className="font-mono text-gray-400 text-sm mb-8">
            Find the best AI Agent builders and view their portfolios.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by username..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0a0a0f] border border-white/10 rounded-full py-3 pl-12 pr-4 text-white font-mono text-sm focus:border-brand-cyan outline-none"
            />
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredUsers.length === 0 ? (
            <p className="text-center text-gray-500 font-mono text-sm col-span-2 py-10">No creators found.</p>
          ) : (
            filteredUsers.map((user) => (
              <Link href={`/creator/${user.wallet_address}`} key={user.wallet_address}>
                <div className="bg-[#0a0a0f] border border-white/10 rounded-xl p-6 flex items-center justify-between hover:border-brand-cyan/50 transition-colors group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-brand-cyan/20 to-brand-purple/20 rounded-full flex items-center justify-center border border-white/10">
                      <User className="w-6 h-6 text-brand-cyan" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-brand-cyan transition-colors flex items-center gap-2">
                        {user.username || "Anonymous"} <ShieldCheck className="w-4 h-4 text-brand-cyan" />
                      </h3>
                      <p className="font-mono text-[10px] text-gray-500">
                        {user.wallet_address.slice(0, 6)}...{user.wallet_address.slice(-4)}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-gray-500 group-hover:text-white transition-colors">View Portfolio →</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  );
}