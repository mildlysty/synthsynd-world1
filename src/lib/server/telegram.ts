import "server-only";

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

export async function sendTelegramMessage(message: string) {
  if (!botToken || !chatId) {
    throw new Error("Missing Telegram bot configuration.");
  }

  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        disable_web_page_preview: true,
      }),
      cache: "no-store",
    }
  );

  const result = await response.json();

  if (!response.ok || !result.ok) {
    throw new Error(
      `Telegram message failed: ${result.description ?? "Unknown error"}`
    );
  }

  return result;
}
