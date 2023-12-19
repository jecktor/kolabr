/// <reference types="lucia" />
declare global {
	namespace Lucia {
		type Auth = import('$lib/server/lucia').Auth;
		type DatabaseUserAttributes = {
			name: string;
			email: string;
			image: string;
			lang: string;
		};
		//eslint-disable-next-line
		type DatabaseSessionAttributes = {};
	}
}

/// <reference types="@sveltejs/kit" />
declare type Item = import('svelte-dnd-action').Item;
declare type DndEvent<ItemType = Item> = import('svelte-dnd-action').DndEvent<ItemType>;
declare namespace svelteHTML {
	interface HTMLAttributes<T> {
		'on:consider'?: (event: CustomEvent<DndEvent<ItemType>> & { target: EventTarget & T }) => void;
		'on:finalize'?: (event: CustomEvent<DndEvent<ItemType>> & { target: EventTarget & T }) => void;
	}
}

export {};
