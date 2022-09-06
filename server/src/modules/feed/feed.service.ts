import {Service} from 'fastify-decorators';
import {DatabaseService} from '../../database/DatabaseService';
import {PhotoService} from '../photo/photo.service';
import {GetPhotosQueryStringType, GetUsersQueryStringType} from './feed.schema';

@Service('FeedServiceToken')
export class FeedService {
  constructor(
    private readonly databaseService: DatabaseService,
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
        // rankings: {
        //   _count: 'desc',
        // },
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

    const _photos = photos.map(({rankings, ...rest}) => ({
      ...rest,
      ranking: this.photoService.calcPhotoRanking(rankings),
    }));

    return _photos.sort((a, b) => {
      if (a.ranking > b.ranking) {
        return -1;
      }
      if (a.ranking < b.ranking) {
        return 1;
      }

      return 0;
    });
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
