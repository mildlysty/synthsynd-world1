import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ reply: "[SYSTEM ERROR] GEMINI_API_KEY is missing in .env.local" }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const { message, agentName, agentPrompt } = await req.json();

    const systemPrompt = `
      You are an AI Agent named "${agentName || "Synthsynd Agent"}" operating on the Synthsynd World platform.
      Your core directive (prompt) is: "${agentPrompt || "You are a helpful AI assistant."}"
      
      Rules:
      1. You must answer user questions intelligently, just like ChatGPT.
      2. You must adopt the persona described in your directive.
      3. Keep your answers helpful and concise.
    `;

    // Attempt to generate content
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash", 
      contents: message,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7, 
      },
    });

    return NextResponse.json({ reply: response.text });
    
  } catch (error: any) {
    console.error("GEMINI API ERROR:", error.message);
    
    // 🚨 HANDLE THE 503 SERVER BUSY ERROR GRACEFULLY
    if (error.message?.includes("503") || error.message?.includes("UNAVAILABLE")) {
       return NextResponse.json(
         { reply: "[SYSTEM BUSY] Neural network is currently overloaded by high traffic. Please try again in 5 seconds." }, 
         { status: 200 }
       );
    }

    // Handle other errors
    return NextResponse.json(
      { reply: `[SYSTEM ERROR] Connection interrupted. Please try again.` }, 
      { status: 500 }
    );
  }
}