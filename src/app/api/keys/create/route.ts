import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Must be service role for admin actions
);

export async function POST(req: Request) {
  const { userId } = await req.json(); // Get from your auth session
  
  // 1. Generate a secure random key
  const rawKey = `sk_live_${crypto.randomBytes(32).toString("hex")}`;
  const keyHash = crypto.createHash("sha256").update(rawKey).digest("hex");
  const keyPrefix = rawKey.slice(0, 12);

  // 2. Store the HASH, never the raw key
  const { error } = await supabase.from("api_keys").insert({
    user_id: userId,
    key_hash: keyHash,
    key_prefix: keyPrefix,
    is_active: true,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // 3. Return the raw key ONCE to the user
  return NextResponse.json({ key: rawKey });
} 