// src/pages/api/chat.ts
import { Configuration, OpenAIApi } from "openai";

const apiKey = import.meta.env.OPENAI_KEY;

export const post = async ({ request }) => {
  if (request.headers.get("Content-Type") !== "application/json") {
    return new Response(null, { status: 400 });
  }

  const body = await request.json();
  const message = body.message;

  if (message === undefined) {
    return new Response(JSON.stringify({ error: "Message is required" }), { status: 400 });
  }

  // Set up OpenAI API
  const configuration = new Configuration({
    apiKey: apiKey,
  });

  const openai = new OpenAIApi(configuration);

  // Chat Completion settings
  const settings = {
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: message },
    ],
  };

  try {
    const completion = await openai.createChatCompletion(settings);
    // Return the completion message as JSON
    return new Response(JSON.stringify(completion.data.choices[0].message), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
