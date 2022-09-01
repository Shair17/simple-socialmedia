import {Service} from 'fastify-decorators';
import {UserService} from '../user';
import {DatabaseService} from '../../database/DatabaseService';
import {PhotoService} from '../photo/photo.service';
import {GetPhotosQueryStringType, GetUsersQueryStringType} from './feed.schema';

@Service('FeedServiceToken')
export class FeedService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly userService: UserService,
    private readonly photoService: PhotoService,
  ) {}

  async getPhotosFeed({
    orderBy = 'desc',
    skip = 0,
    take = 10,
  }: GetPhotosQueryStringType) {
    const photos = await this.databaseService.photo.findMany({
      take: Number(take) || undefined,
      skip: Number(skip) || undefined,
      orderBy: {
        createdAt: orderBy,
      },
      select: {
        id: true,
        filename: true,
        title: true,
        url: true,
        user: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
        rankings: true,
        description: true,
        createdAt: true,
      },
    });

    return photos.map(({rankings, ...rest}) => ({
      ...rest,
      ranking: this.photoService.calcPhotoRanking(rankings),
    }));
  }

  async getUsersFeed({take}: GetUsersQueryStringType) {
    // const users = await this.userService.getMostActiveUsers(take);
    const users = await this.databaseService.user.findMany({
      take,
      orderBy: {
        photos: {
          _count: 'desc',
        },
      },
      include: {
        photos: true,
      },
    });

    return users.map(
      ({photos, password, refreshToken, resetPasswordToken, ...rest}) => ({
        ...rest,
        photosCount: photos.length,
      }),
    );
  }
}
