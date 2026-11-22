import { NextResponse } from "next/server";
import { Connection, PublicKey } from "@solana/web3.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const connection = new Connection(process.env.NEXT_PUBLIC_HELIUS_RPC_URL || "https://api.mainnet-beta.solana.com");

export async function POST(req: Request) {
  try {
    const { walletAddress } = await req.json();
    if (!walletAddress) return NextResponse.json({ error: "Wallet required" }, { status: 400 });

    // 1. Get Wallet Data
    const publicKey = new PublicKey(walletAddress);
    const balance = await connection.getBalance(publicKey);
    const solBalance = balance / 1e9;
    const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 50 });
    const txCount = signatures.length;

    // 2. Real AI Generation
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
      You are an expert crypto analyst. Analyze this Solana wallet:
      - SOL Balance: ${solBalance}
      - Recent Transactions: ${txCount}
      
      Return ONLY a raw JSON object with exactly these keys. Do not use markdown, do not use backticks, just pure JSON:
      {
        "personality": "A funny 2-3 word archetype",
        "score": 50, 
        "roast": "A funny, slightly roasting one-sentence summary",
        "advice": "One sentence of alpha advice"
      }
    `;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();
    
    // 3. Robust JSON Extraction (Strips out markdown if the AI adds it)
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI did not return valid JSON");
    
    const auditData = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ success: true, audit: auditData });

  } catch (error: any) {
    // 🚨 THIS WILL SEND THE REAL ERROR TO THE FRONTEND 🚨
    console.error("AUDIT ERROR:", error.message);
    return NextResponse.json({ error: error.message || "Failed to generate audit" }, { status: 500 });
  }
}