import {Controller, POST, GET, DELETE} from 'fastify-decorators';
import {hasBearerToken, IsAuthenticated} from '../../shared/hooks/auth';
import {Reply, Request} from '../../interfaces/http';
import {PhotoService} from './photo.service';
import {
  GetPhotoParams,
  GetPhotoParamsType,
  DeletePhotoParams,
  DeletePhotoParamsType,
} from './photo.schema';

@Controller('/photos')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  // TODO: agregar paginacion
  @GET('/')
  async getPhotos() {
    return this.photoService.getPhotos();
  }

  @GET('/:id', {schema: {params: GetPhotoParams}})
  async getPhoto(request: Request<{Params: GetPhotoParamsType}>, reply: Reply) {
    return this.photoService.getPhoto(request.params);
  }

  @POST('/upload', {
    onRequest: [hasBearerToken, IsAuthenticated],
  })
  async uploadPhoto(request: Request, reply: Reply) {
    // @ts-ignore
    return this.photoService.uploadPhoto(request.raw.files.image);
  }

  @DELETE('/:id', {
    schema: {params: DeletePhotoParams},
    onRequest: [hasBearerToken, IsAuthenticated],
  })
  async deletePhoto(
    request: Request<{Params: DeletePhotoParamsType}>,
    reply: Reply,
  ) {
    return this.photoService.deletePhoto(request.userId, request.params);
  }
}
