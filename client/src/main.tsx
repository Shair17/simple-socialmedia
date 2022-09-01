import './styles/app.css';
import 'bulma/css/bulma.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { Toaster } from 'react-hot-toast';
import { configure } from 'axios-hooks';
import { cache } from './cache';
import { register } from 'timeago.js';
import { http as axios } from './services/http';
import { getDateLang } from './utils/getDateLang';

register('es_PE', getDateLang);
configure({ axios, cache });

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<BrowserRouter>
			<App />
			<Toaster position="bottom-right" />
		</BrowserRouter>
	</React.StrictMode>
);
