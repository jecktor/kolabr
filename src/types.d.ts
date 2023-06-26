import type { Room, LiveObject, LiveList } from '@liveblocks/client';

// Presence represents the properties that will exist on every User in the
// Room and that will automatically be kept in sync. Accessible through the
// `user.presence` property. Must be JSON-serializable.
export type Presence = {
	cursor: { x: number; y: number } | null;
	focusedId: string | null;
};

// Optionally, Storage represents the shared document that persists in the
// Room, even after all Users leave. Fields under Storage typically are
// LiveList, LiveMap, LiveObject instances, for which updates are
// automatically persisted and synced to all connected clients.
export type Storage = {
	[key: string]: LiveObject | LiveList;
};

// Optionally, UserMeta represents static/readonly metadata on each User, as
// provided by your own custom auth backend (if used). Useful for data that
// will not change during a session, like a User's name or avatar.
export type UserMeta = {
	id: string; // Accessible through `user.id`
	info: {
		name: string;
		image: string;
		color: string;
	};
};

// Optionally, the type of custom events broadcasted and listened for in this
// room. Must be JSON-serializable.
export type RoomEvent = {
	// ...
};

export type LiveStorage = LiveObject<Storage>;

export type LiveRoom = Room<Presence, Storage, UserMeta, RoomEvent>;

// Misc types

type InputEvent = Event & {
	currentTarget: EventTarget & HTMLInputElement;
};

// Temporary types

type Member = {
	email: string;
	name: string;
	image: string;
};

type Tag = {
	id: string;
	name: string;
};

type Ticket = {
	id: string;
	name: string;
	description: string;
	deadline: string;
	members: Memeber[];
	tags: Tag[];
};

type Lane = {
	id: string;
	name: string;
	limit: number;
	tickets: Ticket[];
};

type BoardInfo = {
	name: string;
};
