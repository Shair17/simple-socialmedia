import { useEffect, useState } from 'react';

export function useDate() {
	const [today, setDate] = useState<Date>(new Date());

	useEffect(() => {
		const timer = setInterval(() => {
			setDate(new Date());
		}, 60 * 1000);

		return () => {
			clearInterval(timer);
		};
	}, []);

	const hour = today.getHours();
	const greeting = `${
		(hour < 12 && 'Buenos días') ||
		(hour < 18 && 'Buenas tardes') ||
		'Buenas noches'
	}`;

	const time = today.toLocaleTimeString('es', {
		hour: 'numeric',
		hour12: true,
		minute: 'numeric',
	});

	return {
		time,
		greeting,
	};
}
