import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { sendTelegramMessage } from "@/lib/server/telegram";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const expectedSecret = process.env.TRADING_ALERTS_TEST_SECRET;
  const providedSecret = request.headers.get("authorization")?.replace(
    /^Bearer\s+/i,
    ""
  );

  if (!expectedSecret || !providedSecret) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const expected = Buffer.from(expectedSecret);
  const provided = Buffer.from(providedSecret);

  if (
    expected.length !== provided.length ||
    !timingSafeEqual(expected, provided)
  ) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await sendTelegramMessage(
      "⚡ SYNTHSYND WORLD — TELEGRAM TEST\n\n" +
      "Your trading alerts bot is connected successfully!\n\n" +
      "Next step: Helius on-chain integration."
    );

    return NextResponse.json({
      success: true,
      message: "Telegram test message sent."
    });
  } catch (error) {
    console.error("Telegram test failed:", error);

    return NextResponse.json(
      { error: "Telegram message could not be sent." },
      { status: 500 }
    );
  }
}
