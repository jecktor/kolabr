import { Storage } from '@google-cloud/storage';
import { randomId } from '$utils';
import { GCS_CREDENTIALS, GCS_BUCKET } from '$env/static/private';

const storage = new Storage({
	credentials: JSON.parse(GCS_CREDENTIALS)
});

const bucket = storage.bucket(GCS_BUCKET);

export async function deleteFile(url: string) {
	const splitUrl = url.split('/');
	const path = splitUrl.slice(splitUrl.length - 2).join('/');

	await bucket.file(path).delete();
}

export async function uploadFile(file: File) {
	const path = `upload/${randomId()}.${file.name.split('.').pop()}`;
	const buffer = Buffer.from(await file.arrayBuffer());

	await bucket.file(path).save(buffer);

	return `https://storage.googleapis.com/${GCS_BUCKET}/${path}`;
}
