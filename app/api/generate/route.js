import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function getTodayKey() {
  return new Date().toISOString().split("T")[0]; // "2026-02-15"
}

export async function POST(request) {
  try {
    const { theme, philosopher } = await request.json();
    const todayKey = getTodayKey();

    // Check Supabase cache first
    const { data: cached } = await supabase
      .from("reflections")
      .select("text")
      .eq("date_key", todayKey)
      .eq("philosopher", philosopher)
      .maybeSingle();

    if (cached) {
      return NextResponse.json({ text: cached.text });
    }

    // Generate new reflection via Anthropic
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are channeling the voice of ${philosopher}, the Stoic philosopher. Write a brief, original Stoic reflection on the theme of: ${theme}.

Write 2-4 sentences. The tone should be meditative, direct, and timeless — as if written in a personal journal. Do not use quotation marks. Do not attribute it. Do not add a title. Just the reflection itself.

Then on a new line, write a single short practical instruction beginning with a verb — something the reader can do today to embody this wisdom. Keep it to one sentence, grounded and actionable.`,
        },
      ],
    });

    const text = message.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    // Cache in Supabase
    await supabase.from("reflections").insert({
      date_key: todayKey,
      philosopher,
      theme,
      text,
    });

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate reflection" },
      { status: 500 }
    );
  }
}
