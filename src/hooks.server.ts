import { SvelteKitAuth } from '@auth/sveltekit';
import GoogleProvider from '@auth/core/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';

const prisma = new PrismaClient();

export const handle = SvelteKitAuth({
	adapter: {
		...PrismaAdapter(prisma),
		linkAccount: async ({ ...data }) => {
			if (data.expires_at) {
				delete data.expires_at;
			}

			prisma.account.create({ data });
		}
	},
	providers: [
		GoogleProvider({
			clientId: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET
		})
	]
});
