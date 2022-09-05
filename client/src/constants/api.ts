import { isDev } from '../utils/isDev';

export const BASE_URL = isDev
	? 'http://localhost:3000'
	: 'https://ea-work-api.shair.dev';
