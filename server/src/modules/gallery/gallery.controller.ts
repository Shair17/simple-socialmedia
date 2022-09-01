import { Controller, GET, POST, PUT, DELETE } from 'fastify-decorators';
import { GalleryService } from './gallery.service';
import { hasBearerToken, IsAuthenticated } from '../../shared/hooks/auth';
import { Reply, Request } from '../../interfaces/http';
import { GetGalleryParams, GetGalleryParamsType } from './gallery.schema';

@Controller('/gallery')
export class GalleryController {
	constructor(private readonly galleryService: GalleryService) {}

	@GET('/count')
	async getCount() {
		return this.galleryService.count();
	}

	@GET('/user/count', { onRequest: [hasBearerToken, IsAuthenticated] })
	async getCountByUserId(request: Request, reply: Reply) {
		return this.galleryService.countByUserId(request.userId);
	}

	@GET('/:id', { schema: { params: GetGalleryParams } })
	async getGallery(
		request: Request<{ Params: GetGalleryParamsType }>,
		reply: Reply
	) {
		return this.galleryService.getGallery(request.params);
	}
}
