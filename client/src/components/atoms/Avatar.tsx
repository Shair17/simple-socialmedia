import { FC } from 'react';

interface Props {
	name: string;
}

export const Avatar: FC<Props> = ({ name }) => {
	const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`;

	return (
		<p className="image is-48x48">
			<img className="is-rounded" src={avatar} alt={name} />
		</p>
	);
};
