import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectToDB } from "@/lib/mongoose";
import User from "@/models/User";
import { z } from "zod";



const credentialsSchema = z.object({
	email: z.string().email({ message: "Incorrect login or password" }),
  	password: z.string().min(8, { message: "Password must be at least 8 characters long" })
});


const loginAttempts: Record<string, { count: number; last: number }> = {};
const MAX_ATTEMPTS = 5;
const BLOCK_TIME = 15 * 60 * 1000;


export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
		name: "Credentials",
		credentials: { email: { label: "Email", type: "text" }, password: { label: "Password", type: "password" } },
		async authorize(credentials?: { email?: string; password?: string }) {
			if (!credentials?.email || !credentials?.password) return null;

			const parseResult = credentialsSchema.safeParse(credentials);
			if (!parseResult.success) return null;

			const { email, password } = parseResult.data;
			const ip = email || "unknown";

			const attempt = loginAttempts[ip] || { count: 0, last: 0 };
			if (attempt.count >= MAX_ATTEMPTS && Date.now() - attempt.last < BLOCK_TIME) return null;

			await connectToDB();
			const user = await User.findOne({ email: email.toLowerCase().trim() });
			if (!user) {
			loginAttempts[ip] = { count: attempt.count + 1, last: Date.now() };
			return null;
			}

			const isValid = await bcrypt.compare(password, user.password);
			if (!isValid) {
			loginAttempts[ip] = { count: attempt.count + 1, last: Date.now() };
			return null;
			}

			loginAttempts[ip] = { count: 0, last: Date.now() };
			return { id: user._id.toString(), email: user.email, name: user.name };
		},
		}),
	],
	session: { strategy: "jwt", maxAge: 60 * 60 },
	secret: process.env.NEXTAUTH_SECRET,
	callbacks: {
		async jwt({ token, user }) {
		if (user) token.id = (user as any).id || (user as any)._id;
		return token;
		},
		async session({ session, token }) {
		if (token?.id) (session.user as any).id = token.id;
		return session;
		},
		async redirect({ url, baseUrl }) {
		if (url.startsWith(baseUrl)) return url;
		if (url.startsWith("/")) return `${baseUrl}${url}`;
		return baseUrl;
		},
  	},
};
