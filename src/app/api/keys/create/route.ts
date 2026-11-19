import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    // 1. Initialize Supabase INSIDE the function so it doesn't break the build
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { userId } = await req.json(); 

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // 2. Generate a secure random key
    const rawKey = `sk_live_${crypto.randomBytes(32).toString("hex")}`;
    const keyHash = crypto.createHash("sha256").update(rawKey).digest("hex");
    const keyPrefix = rawKey.slice(0, 12);

    // 3. Store the HASH, never the raw key
    const { error } = await supabase.from("api_keys").insert({
      user_id: userId,
      key_hash: keyHash,
      key_prefix: keyPrefix,
      is_active: true,
    });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 4. Return the raw key ONCE to the user
    return NextResponse.json({ key: rawKey });
    
  } catch (error: any) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}