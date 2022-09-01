import useAxios from 'axios-hooks';
import { FC } from 'react';
import { FeedUser } from '../organisms/FeedUser';
import { UsersTopResponse } from '../../interfaces/app';
import { TabIsLoading } from '../atoms/TabIsLoading';

export const UsersTop: FC = () => {
	const [{ error, loading, data }] = useAxios<UsersTopResponse[]>(
		'/feed/users?take=10'
	);

	if (loading) return <TabIsLoading />;

	if (error || !data) {
		return <p>Ha ocurrido un error.</p>;
	}

	return (
		<>
			{data.map(({ id, description, name, photosCount, username }) => (
				<FeedUser
					key={id}
					id={id}
					description={description}
					name={name}
					photosCount={photosCount}
					username={username}
				/>
			))}
		</>
	);
};
