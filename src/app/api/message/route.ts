import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';



const ALLOWED_ORIGIN: string = process.env.ALLOWED_ORIGIN!;

const requestSchema = z.object({
 	message: z.string().min(1, "Message is required").max(2000, "Message too long"),
});


export async function POST(req: NextRequest) {
	const origin = req.headers.get('origin');
	const referer = req.headers.get('referer');
	
	if (origin && origin !== ALLOWED_ORIGIN) {
		return NextResponse.json({ error: 'Forbidden: invalid origin' }, { status: 403 });
	};
	if (referer && !referer.startsWith(ALLOWED_ORIGIN)) {
		return NextResponse.json({ error: 'Forbidden: invalid referer' }, { status: 403 });
	};


	const session = await getServerSession(authOptions);
	if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	try {
		
		const body = await req.json();
		const parsed = requestSchema.safeParse(body);
		if (!parsed.success) {
      		return NextResponse.json(
    	{ error: "Invalid input", issues: parsed.error.issues },
        { status: 400 }
      	);
    	}
		const { message } = parsed.data;



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
	} catch {
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
};
