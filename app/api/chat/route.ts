import { NextResponse } from "next/server";

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

function detectLanguage(text: string): "fa" | "en" | "de" {
  // Persian / Arabic script
  if (/[\u0600-\u06FF]/.test(text)) {
    return "fa";
  }

  // Common German characters/words
  if (
    /[äöüÄÖÜß]/.test(text) ||
    /\b(ich|du|wir|sie|was|wie|wo|warum|bedeutet|bedeutung|lernen|deutsch|hallo|danke|bitte)\b/i.test(
      text
    )
  ) {
    return "de";
  }

  // Everything else is treated as English
  return "en";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "پیام وارد نشده است.",
        },
        { status: 400 }
      );
    }

    if (!ACCOUNT_ID || !API_TOKEN) {
      return NextResponse.json(
        {
          success: false,
          message: "Cloudflare API تنظیم نشده است.",
        },
        { status: 500 }
      );
    }

    const language = detectLanguage(message);

    const languageInstruction = {
      fa: `
The user's current message is in Persian.
You MUST answer in Persian.
Do not answer in German or English unless the user explicitly asks for a translation.
`,
      en: `
The user's current message is in English.
You MUST answer in English.
Do not answer in German or Persian unless the user explicitly asks for a translation.
`,
      de: `
The user's current message is in German.
You MUST answer in German.
Do not answer in English or Persian unless the user explicitly asks for a translation.
`,
    }[language];

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/@cf/meta/llama-3.1-8b-instruct`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `
You are a friendly German language learning assistant.

${languageInstruction}

Your main purpose is helping the user learn German.

You can help with:
- German grammar
- German vocabulary
- German pronunciation
- German sentences
- German conversation
- translations
- correcting German texts
- German learning

IMPORTANT:
The language of your answer MUST follow the language of the user's CURRENT message.

If the user writes in Persian, answer in Persian.
If the user writes in English, answer in English.
If the user writes in German, answer in German.

Do not change the response language just because the topic is German.

Keep answers clear, friendly and reasonably short.

If the user asks something completely unrelated to German learning,
politely explain that you are a German language learning assistant.
`,
            },
            {
              role: "user",
              content: message,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error("CLOUDFLARE ERROR:", data);

      return NextResponse.json(
        {
          success: false,
          message: "Fehler beim Verbinden mit dem KI-Assistenten.",
        },
        { status: response.status || 500 }
      );
    }

    const reply = data.result?.response;

    if (!reply) {
      return NextResponse.json(
        {
          success: false,
          message: "Die KI hat keine Antwort zurückgegeben.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("CHAT API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Fehler beim Verbinden mit dem KI-Assistenten.",
      },
      { status: 500 }
    );
  }
}