import { NextResponse } from 'next/server';



export async function POST(req: Request) {
  const body = await req.json();
  const { message } = body;



  const response = await fetch(
    'https://llm.api.cloud.yandex.net/foundationModels/v1/completion',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Api-Key ${process.env.YANDEX_API_KEY}`,
      },
      body: JSON.stringify({
        modelUri: `gpt://${process.env.FOLDER_NAME}/yandexgpt-lite`,
        completionOptions: {
          stream: false,
          temperature: 0.6,
          maxTokens: '2000',
          reasoningOptions: {
            mode: 'DISABLED',
          },
        },
        messages: [
          {
            role: 'user',
            text: message,
          },
        ],
      }),
    }
  );

  const data = await response.json();
  return NextResponse.json(data);
};
