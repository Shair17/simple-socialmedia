export interface UsersTopResponse {
	photosCount: number;
	id: string;
	username: string;
	email: string;
	name: string;
	description?: string;
	birthDate: string;
	address: string;
	favoritesPrivate: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface User {
	id: string;
	username: string;
	email: string;
	name: string;
	description?: string;
	birthDate: string;
	address: string;
	createdAt: string;
	updatedAt: string;
	photosCount: number;
	galleryCount: number;
	favoritesCount: number;
	favoritesPrivate: boolean;
	photos: Photo[];
	gallery: PhotoGallery[];
	favorites: FavoritePhotos[];
}

export interface FavoritePhotos {
	id: string;
	photoId: string;
	createdAt: string;
	updatedAt: string;
	userId: string;
}

export interface RegisterType {
	name: string;
	username: string;
	email: string;
	password: string;
	address: string;
	birthDate: string;
}

export interface RegisterResponse {
	accessToken: string;
	refreshToken: string;
	user: User;
}

export interface RegisterBody {
	username: string;
	password: string;
	name: string;
	email: string;
	address: string;
	birthDate: string;
}

export interface UploadImageType {
	title: string;
	description: string;
	image: FileList;
}

export interface LoginType {
	username: string;
	password: string;
}

export interface LoginResponse {
	accessToken: string;
	refreshToken: string;
	user: User;
}

export interface LoginBody {
	username: string;
	password: string;
}

export interface GetUserByUsernameResponse extends User {}

export interface PhotoGallery {}

export interface Photo {
	id: string;
	filename: string;
	title: string;
	description: string;
	url: string;
	createdAt: string;
	updatedAt: string;
	userId: string;
	photoGalleryId?: string;
}

export interface GetPhotosFeed {
	ranking: number;
	createdAt: string;
	id: string;
	filename: string;
	title: string;
	url: string;
	description: string;
	user?: {
		id: string;
		username: string;
		name: string;
	};
}

export interface PhotoRanking {
	id: string;
	value: number;
	createdAt: string;
	updatedAt: string;
	photoId: string;
	userId: string;
}

export interface Comment {
	id: string;
	comment: string;
	createdAt: string;
	updatedAt: string;
	photoId: string;
	userId: string;
	user: {
		name: string;
		username: string;
	};
}
