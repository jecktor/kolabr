/// <reference types="lucia" />
declare namespace Lucia {
	type Auth = import('$lib/server').Auth;
	type UserAttributes = {
		name: string;
		email: string;
		image: string;
		lang: string;
	};
}

/// <reference types="@sveltejs/kit" />
declare namespace App {
	interface Locals {
		auth: import('lucia-auth').AuthRequest;
	}
}
