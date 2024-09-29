import { NextRequest, NextResponse } from "next/server";
import { CohereClient } from "cohere-ai";

// Initialize the Cohere client with the API token (using environment variables is more secure)
const client = new CohereClient({ token: process.env.COHERE_TOKEN });

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Extract the message from the request body (image metadata or any other data you want to send)
    const { data } = await req.json();

    // Construct the message for the chat model
    const message = `I am sharing metadata for a corresponding image from the year ${data.year}, with the following caption: "${data.title}". Give me a nice little story about it. (It can be completely made up.) Make it entertaining for the user. Keep it short and sweet. This is in Toronto. give me a response that i can directly read to the user. don't say "sure here is this" or "here is that" just give me the response.`;

    // Send a request to Cohere's chat model
    const response = await client.chat({
      message: message,
      model: "command-r",
      preamble:
        "You are an AI-assistant chatbot. You are trained to assist users by providing thorough and helpful responses to their queries.",
    });

    // Return the chat response to the client
    return NextResponse.json({ summary: response.text });
  } catch (err) {
    console.error("Error with Cohere API request:", err);
    return NextResponse.json({ summary: "Error" }, { status: 500 });
  }
}
