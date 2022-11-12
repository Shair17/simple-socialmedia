import { isDev } from '../utils/isDev';

export const BASE_URL = isDev
	? 'http://localhost:3000'
	: 'https://simple-socialmedia-production.up.railway.app';
