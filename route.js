import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY. Add it to your .env.local file." },
        { status: 500 }
      );
    }

    const form = await request.formData();
    const file = form.get("image");

    if (!file) {
      return NextResponse.json({ error: "No image uploaded." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mime = file.type || "image/png";

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You extract shopping cart items from screenshots. Return JSON only in this format: {\"items\":[{\"store\":\"\",\"name\":\"\",\"price\":0,\"quantity\":1,\"image\":\"\",\"link\":\"\"}]}. If a value is missing, use an empty string or 0. Do not invent prices."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text:
                "Read this cart screenshot. Extract every visible product name, store/retailer if visible, price, and quantity. Return clean item data. Do not include screenshot coordinates. Do not invent product images."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mime};base64,${base64}`
              }
            }
          ]
        }
      ]
    });

    const parsed = JSON.parse(response.choices[0].message.content || "{\"items\":[]}");
    return NextResponse.json({ items: parsed.items || [] });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Screenshot import failed." },
      { status: 500 }
    );
  }
}
