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

// Auth types

interface IUser {
	_id: string;
	name: string;
	email: string;
	image: string;
	lang: string;
}

interface IKey {
	_id: string;
	user_id: string;
	hashed_password: string;
}

interface ISession {
	_id: string;
	user_id: string;
	active_expires: number;
	idle_expires: number;
}

// Board types

interface IBoard {
	_id: string;
	name: string;
	last_edited: string;
	owner: {
		_id: string;
		name: string;
	};
	shared_with: string[];
	tags: {
		_id: string;
		name: string;
		color: string;
		tickets: string[];
	}[];
	lanes: {
		_id: string;
		name: string;
		limit: number;
		tickets: {
			_id: string;
			name: string;
			description: string;
			deadline: string;
			tags: {
				_id: string;
				name: string;
				color: string;
			}[];
		}[];
	}[];
}

export type ITag = {
	_id: string;
	name: string;
	color: string;
	tickets: string[];
};

export type ITicket = {
	_id: string;
	name: string;
	description: string;
	deadline: string;
	tags: Tag[];
};

export type ILane = {
	_id: string;
	name: string;
	limit: number;
	tickets: Ticket[];
};

export type IBoardInfo = {
	name: string;
	last_edited: string;
};

// Misc types

export type InputEvent = Event & {
	currentTarget: EventTarget & HTMLInputElement;
};
