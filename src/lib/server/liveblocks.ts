import { Liveblocks } from '@liveblocks/node';
import { VITE_LIVEBLOCKS_SECRET_KEY } from '$env/static/private';

export const liveblocks = new Liveblocks({ secret: VITE_LIVEBLOCKS_SECRET_KEY });
