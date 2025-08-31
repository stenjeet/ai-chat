import { connectToDB } from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod';



const ALLOWED_ORIGIN: string = process.env.ALLOWED_ORIGIN!;

const registerSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8, { message: "At least 8 chars" })
});


export async function POST(req: NextRequest) {
	try {
		const origin = req.headers.get('origin');
		const referer = req.headers.get('referer');

		if (origin && origin !== ALLOWED_ORIGIN) {
			return NextResponse.json({ error: 'Forbidden: invalid origin' }, { status: 403 });
		};
		if (referer && !referer.startsWith(ALLOWED_ORIGIN)) {
      		return NextResponse.json({ error: 'Forbidden: invalid referer' }, { status: 403 });
    	};



		const { email, password } = await req.json();
		if (!email || !password) return NextResponse.json({error: 'Email and password required'});

		const parse = registerSchema.safeParse({ email, password});
		if (!parse.success) {
			return NextResponse.json({ error: parse.error.issues[0].message}, {status: 400})
		}

		await connectToDB();

		const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return NextResponse.json({ error: 'User exists' }, { status: 409 });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({ email: email.toLowerCase(), password: hashed });
    return NextResponse.json({ ok: true, user: { id: user._id.toString(), email: user.email, name: user.name } }, { status: 201 });
	} catch {
    	return NextResponse.json({ error: 'Server error' }, { status: 500 });
	};
};