import { NextResponse } from "next/server";
import { Connection, PublicKey } from "@solana/web3.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const connection = new Connection(process.env.NEXT_PUBLIC_HELIUS_RPC_URL || "https://api.mainnet-beta.solana.com");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""; 

export async function POST(req: Request) {
  try {
    const { walletAddress } = await req.json();
    if (!walletAddress) return NextResponse.json({ error: "Wallet required" }, { status: 400 });

    const publicKey = new PublicKey(walletAddress);

    // 1. Fetch on-chain data
    const balance = await connection.getBalance(publicKey);
    const solBalance = balance / 1e9;
    const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 50 });
    const txCount = signatures.length;

    // 2. Ask AI to generate the personality
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
      You are an expert crypto analyst. Analyze this Solana wallet:
      - SOL Balance: ${solBalance}
      - Recent Transactions: ${txCount}
      
      Generate a JSON response with exactly these keys:
      - "personality": A funny, 2-3 word archetype (e.g., "The Paper Hand", "The Degen Sniper", "The Rug Survivor").
      - "score": A number from 1 to 100 based on their activity.
      - "roast": A funny, slightly roasting one-sentence summary of their trading habits.
      - "advice": One sentence of alpha advice for their next trade.
      
      Keep it highly engaging, crypto-native, and ready for Twitter.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().replace(/```json/g, "").replace(/```/g, "");
    const auditData = JSON.parse(responseText);

    // 3. Award 500 XP to the user in Supabase
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: profile } = await supabase
      .from("profiles")
      .select("xp")
      .eq("wallet_address", walletAddress)
      .single();

    if (profile) {
      await supabase
        .from("profiles")
        .update({ xp: (profile.xp || 0) + 500 })
        .eq("wallet_address", walletAddress);
    }

    return NextResponse.json({ success: true, audit: auditData });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate audit" }, { status: 500 });
  }
}