import lucia from 'lucia-auth';
import { sveltekit } from 'lucia-auth/middleware';
import { mysql2 } from '@lucia-auth/adapter-mysql';
import { dev } from '$app/environment';
import { db } from './db';

export const auth = lucia({
	adapter: mysql2(db),
	env: dev ? 'DEV' : 'PROD',
	transformDatabaseUser: (userData) => {
		return {
			userId: userData.id,
			name: userData.name,
			image: userData.image
		};
	},
	middleware: sveltekit()
});

export type Auth = typeof auth;
