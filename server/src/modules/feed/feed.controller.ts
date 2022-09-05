import type {FastifyRequest as Request, FastifyReply as Reply} from 'fastify';
import {Controller, GET} from 'fastify-decorators';
import {
  GetUsersQueryString,
  GetUsersQueryStringType,
  GetPhotosQueryString,
  GetPhotosQueryStringType,
} from './feed.schema';
import {FeedService} from './feed.service';

@Controller('/feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @GET('/photos', {
    schema: {
      querystring: GetPhotosQueryString,
    },
  })
  async getPhotosFeed(
    request: Request<{Querystring: GetPhotosQueryStringType}>,
    reply: Reply,
  ) {
    return this.feedService.getPhotosFeed(request.query);
  }

  @GET('/users', {
    schema: {
      querystring: GetUsersQueryString,
    },
  })
  async getUsersFeed(
    request: Request<{Querystring: GetUsersQueryStringType}>,
    reply: Reply,
  ) {
    return this.feedService.getUsersFeed(request.query);
  }
}
