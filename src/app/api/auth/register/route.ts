import { connectToDB } from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";



export async function POST(req: Request) {
	try {
		const { email, password, name } = await req.json();
		if (!email || !password) return NextResponse.json({error: 'Email and password required'});

		await connectToDB();

		const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return NextResponse.json({ error: 'User exists' }, { status: 409 });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({ email: email.toLowerCase(), password: hashed, name });
    return NextResponse.json({ ok: true, user: { id: user._id.toString(), email: user.email, name: user.name } }, { status: 201 });
	} catch (err) {
		console.error(err);
    	return NextResponse.json({ error: 'Server error' }, { status: 500 });
	};
};