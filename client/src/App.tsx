import { Routes, Route } from 'react-router-dom';
import { NotFoundPage } from './pages/NotFound';
import { IndexPage } from './pages/index';
import { LoginPage } from './pages/login';
import { RegisterPage } from './pages/register';
import { UsersPage } from './pages/users';
import { User } from './pages/users/user';
import { PhotosPage } from './pages/photos';
import { Photo } from './pages/photos/photo';
import { GalleryPage } from './pages/gallery';
import { Gallery } from './pages/gallery/gallery';
import { UploadPage } from './pages/upload';
import { NewGalleryPage } from './pages/new';

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<IndexPage />} />
				<Route path="/users/*" element={<User />} />
				<Route path="/users" element={<UsersPage />} />
				<Route path="/users/:username" element={<User />} />

				<Route path="/photos/*" element={<Photo />} />
				<Route path="/photos" element={<PhotosPage />} />
				<Route path="/photos/:id" element={<Photo />} />

				<Route path="/gallery/*" element={<Gallery />} />
				<Route path="/gallery" element={<GalleryPage />} />
				<Route path="/gallery/:id" element={<Gallery />} />

				<Route path="/upload" element={<UploadPage />} />
				<Route path="/new" element={<NewGalleryPage />} />

				<Route path="/login" element={<LoginPage />} />
				<Route path="/register" element={<RegisterPage />} />

				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</>
	);
}

export default App;
