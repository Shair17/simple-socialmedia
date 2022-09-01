import { format, TDate } from 'timeago.js';

export const formatDate = (date: TDate) => {
	return format(date, 'es_PE');
};
