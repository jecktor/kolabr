import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';
import { mongoose } from '@lucia-auth/adapter-mongoose';
import { dev } from '$app/environment';
import { User, Key, Session } from './db';

export const auth = lucia({
	adapter: mongoose({
		User,
		Key,
		Session
	}),
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	getUserAttributes: (data) => {
		return {
			userId: data.id,
			name: data.name,
			email: data.email,
			image: data.image,
			lang: data.lang
		};
	}
});

export type Auth = typeof auth;
