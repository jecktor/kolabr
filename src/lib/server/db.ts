import mongoose from 'mongoose';
import { MONGODB_URI } from '$env/static/private';
import type { IUser, IKey, ISession, IBoard } from '$types';

const userSchema = new mongoose.Schema<IUser>(
	{
		_id: {
			type: String,
			required: true
		},
		name: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true
		},
		image: {
			type: String,
			required: true
		},
		lang: {
			type: String,
			required: true
		}
	} as const,
	{ _id: false }
);

const keySchema = new mongoose.Schema<IKey>(
	{
		_id: {
			type: String,
			required: true
		},
		user_id: {
			type: String,
			required: true
		},
		hashed_password: String
	} as const,
	{ _id: false }
);

const sessionSchema = new mongoose.Schema<ISession>(
	{
		_id: {
			type: String,
			required: true
		},
		user_id: {
			type: String,
			required: true
		},
		active_expires: {
			type: Number,
			required: true
		},
		idle_expires: {
			type: Number,
			required: true
		}
	} as const,
	{ _id: false }
);

const boardSchema = new mongoose.Schema<IBoard>(
	{
		_id: {
			type: String,
			required: true
		},
		name: {
			type: String,
			required: true
		},
		last_edited: {
			type: String,
			required: true
		},
		owner: {
      _id: String,
      name: String,
    },
		shared_with: [String],
    tags: [
      {
        _id: String,
        name: String,
        color: String,
        tickets: [String]
      }
    ],
		lanes: [
			{
        _id: String,
				name: String,
				limit: Number,
				tickets: [
					{
            _id: String,
						name: String,
						description: String,
						deadline: String,
						tags: [
              {
                _id: String,
                name: String,
                color: String,
              }
            ]
					}
				]
			}
		]
	} as const,
	{ _id: false }
);

mongoose.connect(MONGODB_URI);

// eslint-disable-next-line
type TBoard = mongoose.Model<IBoard, {}, {}, {}, mongoose.Document<unknown, {}, IBoard> & IBoard & Required<{ _id: string; }>, any>
// eslint-disable-next-line
type TUser = mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser> & IUser & Required<{ _id: string; }>, any>

export const User = (mongoose.models.User as TUser) || mongoose.model<IUser>('User', userSchema);
export const Key = mongoose.models.Key || mongoose.model<IKey>('Key', keySchema);
export const Session =
	mongoose.models.Session || mongoose.model<ISession>('Session', sessionSchema);
export const Board =
	(mongoose.models.Board as TBoard) || mongoose.model<IBoard>('Board', boardSchema);
