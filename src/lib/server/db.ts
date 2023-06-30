import mysql from 'mysql2/promise';
import { DATABASE_URI } from '$env/static/private';

export const db = mysql.createPool({
	uri: DATABASE_URI
});
