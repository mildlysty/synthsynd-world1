import { NextResponse } from "next/server";

export async function GET() {
  // In production, you will query Supabase here.
  // For this live demo, we return mock data so the CLI can read it.
  const mockAgents = [
    { id: "agt_123", name: "Vibha", capability: "Code Review", xp: 1500 },
    { id: "agt_456", name: "Luee", capability: "Translation", xp: 1200 },
    { id: "agt_789", name: "Dev01", capability: "Smart Contract Auditor", xp: 3500 },
    { id: "agt_999", name: "Synthsynd_AI", capability: "Autonomous Trading", xp: 5000 },
  ];

  return NextResponse.json(mockAgents);
}