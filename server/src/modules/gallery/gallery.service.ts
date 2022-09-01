import {Service} from 'fastify-decorators';
import {DatabaseService} from '../../database/DatabaseService';
import {UserService} from '../user/user.service';
import {GetGalleryParamsType} from './gallery.schema';
import {NotFound} from 'http-errors';

@Service('GalleryServiceToken')
export class GalleryService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly userService: UserService,
  ) {}

  count() {
    return this.databaseService.photoGallery.count();
  }

  async getGalleryCountByUserId(userId: string): Promise<number> {
    return this.databaseService.photoGallery.count({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  async countByUserId(userId: string) {
    const user = await this.userService.getByIdOrThrow(userId);

    return this.databaseService.photoGallery.count({
      where: {user: {id: user.id}},
    });
  }

  async getGalleryById(id: string) {
    return this.databaseService.photoGallery.findUnique({
      where: {id},
    });
  }

  async getGalleryByIdOrThrow(id: string) {
    const gallery = await this.getGalleryById(id);

    if (!gallery) {
      throw new NotFound();
    }

    return gallery;
  }

  async getGallery({id}: GetGalleryParamsType) {
    return this.getGalleryByIdOrThrow(id);
  }
}
