import type {FastifyRequest as Request, FastifyReply as Reply} from 'fastify';
import {Controller, GET, POST, PUT} from 'fastify-decorators';
import {hasBearerToken, IsAuthenticated} from '../../shared/hooks/auth';
import {
  ChangeUserDescriptionParams,
  ChangeUserDescriptionParamsType,
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

  @PUT('/:username/description', {
    onRequest: [hasBearerToken, IsAuthenticated],
    schema: {
      body: ChangeUserDescriptionParams,
    },
  })
  async changeUserDescription(
    request: Request<{
      Body: ChangeUserDescriptionParamsType;
    }>,
    reply: Reply,
  ) {
    return this.userService.changeUserDescription(request.userId, request.body);
  }
}
