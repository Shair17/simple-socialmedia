import {Controller, GET} from 'fastify-decorators';
import {Reply, Request} from '../../interfaces/http';
import {hasBearerToken, IsAuthenticated} from '../../shared/hooks/auth';
import {
  GetFavoritesByUsernameParams,
  GetFavoritesByUsernameParamsType,
  GetGalleryByUsernameParams,
  GetGalleryByUsernameParamsType,
  GetPhotosByUsernameParams,
  GetPhotosByUsernameParamsType,
  GetUserByUsernameParams,
  GetUserByUsernameParamsType,
} from './user.schema';
import {UserService} from './user.service';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GET('/')
  async getUsers(request: Request, reply: Reply) {
    return this.userService.getUsers();
  }

  @GET('/count')
  async getCount() {
    return this.userService.count();
  }

  @GET('/me', {onRequest: [hasBearerToken, IsAuthenticated]})
  async me(request: Request, reply: Reply) {
    return this.userService.me(request.userId);
  }

  @GET('/:username', {
    schema: {
      params: GetUserByUsernameParams,
    },
  })
  async getUserByUsername(
    request: Request<{Params: GetUserByUsernameParamsType}>,
    reply: Reply,
  ) {
    return this.userService.getUserByUsername(request.params);
  }

  @GET('/:username/photos', {
    schema: {
      params: GetPhotosByUsernameParams,
    },
  })
  async getPhotosByUsername(
    request: Request<{Params: GetPhotosByUsernameParamsType}>,
    reply: Reply,
  ) {
    return this.userService.getPhotosByUsername(request.params);
  }

  @GET('/:username/gallery', {
    schema: {
      params: GetGalleryByUsernameParams,
    },
  })
  async getGalleryByUsername(
    request: Request<{Params: GetGalleryByUsernameParamsType}>,
    reply: Reply,
  ) {
    return this.userService.getGalleryByUsername(request.params);
  }

  @GET('/:username/favorites', {
    schema: {
      params: GetFavoritesByUsernameParams,
    },
  })
  async getFavoritesByUsername(
    request: Request<{Params: GetFavoritesByUsernameParamsType}>,
    reply: Reply,
  ) {
    return this.userService.getFavoritesByUsername(request.params);
  }
}
