import NextAuth, { NextAuthOptions} from "next-auth";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDB } from '@/lib/mongoose';
import User from '@/models/User'



export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'text'},
				password: {label: 'Password', type: 'password'},
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) return null;

				await connectToDB();
				const user = await User.findOne({ email: credentials.email.toLowerCase() });
				if (!user) return null;

				const isValid = await bcrypt.compare(credentials.password, user.password);
				if (!isValid) return null;

				return { id: user._id.toString(), email: user.email, name: user.name};
			},
		}),
	],
	session: {
		strategy: 'jwt',
	},
	callbacks: {
		async jwt({ token, user}) {
			if (user) {
				token.id = (user as any).id || (user as any)._id;
			};
			return token;
		},
		async session({ session, token}) {
			if (token?.id) {
				(session.user as any).id = token.id;
			};
			return session;
		},
	},

	secret: process.env.NEXTAUTH_SECRET,
}



const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };