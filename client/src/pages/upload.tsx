import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadIcon } from '../components/atoms/UploadIcon';
import { RequireAuth } from '../components/hoc/RequireAuth';
import { Layout } from '../components/templates/Layout';
import { useForm } from 'react-hook-form';
import { UploadImageType, Photo } from '../interfaces/app';
import useAxios from 'axios-hooks';
import clsx from 'clsx';
import { toast } from 'react-hot-toast';
import { getErrorMessage } from '../utils/getErrorMessage';

export const UploadPage: FC = () => {
	const [{ loading }, executeUploadImage] = useAxios<
		{ status: boolean; photo: Photo },
		{ title: string; description: string; image: string; filename: string }
	>(
		{
			url: '/photos/upload',
			method: 'POST',
		},
		{ manual: true }
	);
	const {
		handleSubmit,
		register,
		watch,
		formState: { errors },
	} = useForm<UploadImageType>();
	const navigation = useNavigate();
	const fileList = watch('image');

	const onSubmit = handleSubmit(({ title, description, image }) => {
		const reader = new FileReader();
		reader.readAsDataURL(image[0]);
		reader.onloadend = (result) => {
			const base64 = reader.result as string;

			executeUploadImage({
				data: {
					title,
					description,
					image: base64,
					filename: image[0].name,
				},
			})
				.then((response) => {
					const { status, photo } = response.data;

					if (!status || !photo) {
						toast.error('Ha ocurrido un error al subir la foto');
						return;
					}

					navigation(`/photos/${photo.id}`);
				})
				.catch((error) => {
					console.log(error);
					toast.error(getErrorMessage(error?.response?.data?.message));
				});
		};

		reader.onerror = (error) => {
			console.log(error);
		};
	});

	return (
		<RequireAuth>
			<Layout>
				<div className="container is-max-desktop p-5">
					<h1 className="title is-1">Subir una Foto</h1>

					<form onSubmit={onSubmit}>
						<div className="field">
							<label className="label">Título</label>
							<div className="control">
								<input
									className="input"
									type="text"
									placeholder="Ingresa el título de tu foto"
									{...register('title', { required: true })}
								/>
								{errors.title && (
									<strong style={{ color: 'red' }}>
										Introduce un título para tu foto.
									</strong>
								)}
							</div>
						</div>

						<div className="field">
							<label className="label">Descripción</label>
							<div className="control">
								<textarea
									className="textarea"
									placeholder="Ingresa la descripción de tu foto"
									{...register('description', { required: true })}
								/>
								{errors.title && (
									<strong style={{ color: 'red' }}>
										Introduce una descripción para tu foto.
									</strong>
								)}
							</div>
						</div>

						<div className="field">
							<div className="file">
								<label className="file-label">
									<input
										className="file-input"
										type="file"
										accept="image/png, image/gif, image/jpeg, image/jpg"
										{...register('image', { required: true })}
									/>

									<span className="file-cta">
										<span className="file-icon">
											<UploadIcon />
										</span>
										<span className="file-label">
											Elegir una foto para subir...
										</span>
									</span>

									{fileList?.length === 1 && (
										<span className="file-name">{fileList[0].name}</span>
									)}

									{errors.image && (
										<strong style={{ color: 'red' }}>
											Selecciona una foto para subir.
										</strong>
									)}
								</label>
							</div>
						</div>

						<div className="field is-grouped">
							<div className="control">
								<button
									className={clsx('button is-link', loading && 'is-loading')}
									type="submit"
								>
									Subir
								</button>
							</div>
							<div className="control">
								<button
									className="button is-link is-light"
									onClick={() => navigation(-1)}
								>
									Cancelar
								</button>
							</div>
						</div>
					</form>
				</div>
			</Layout>
		</RequireAuth>
	);
};
