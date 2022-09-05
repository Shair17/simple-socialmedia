import {Service} from 'fastify-decorators';
import {DatabaseService} from '../../database/DatabaseService';
import {Unauthorized, BadRequest, NotFound} from 'http-errors';
import {trimStrings} from '../../utils/trimStrings';
import {
  ChangeUserDescriptionParamsType,
  CreateBodyType,
  GetFavoritesByUsernameParamsType,
  GetGalleryByUsernameParamsType,
  GetPhotosByUsernameParamsType,
  GetUserByUsernameParamsType,
} from './user.schema';
import {PasswordService} from '../../shared/services/password.service';
import {USERNAME_REGEX} from '../../constants/regex';

@Service('UserServiceToken')
export class UserService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly passwordService: PasswordService,
  ) {}

  async getUsers() {
    const users = await this.databaseService.user.findMany({
      include: {photos: true, gallery: true, favorites: true},
    });

    return users.map(
      ({password, refreshToken, resetPasswordToken, ...restOfUser}) => ({
        ...restOfUser,
        favoritesCount: restOfUser.favorites.length,
        photosCount: restOfUser.photos.length,
        galleryCount: restOfUser.gallery.length,
      }),
    );
  }

  async me(id: string) {
    const user = await this.getByIdOrThrow(id);
    const photosCount = await this.databaseService.photo.count({
      where: {
        user: {
          id: user.id,
        },
      },
    });

    const {refreshToken, password, resetPasswordToken, ...restOfUser} = user;

    return {
      ...restOfUser,
      photosCount,
    };
  }

  isValidUsername(username: string) {
    return USERNAME_REGEX.test(username);
  }

  async getByUsername(username: string) {
    return this.databaseService.user.findUnique({
      where: {username},
      include: {photos: true, gallery: true, favorites: true},
    });
  }

  async getPhotosByUsername({username}: GetPhotosByUsernameParamsType) {
    const user = await this.getByUsername(username);

    if (!user) {
      throw new NotFound();
    }

    return user.photos;
  }

  async getGalleryByUsername({username}: GetGalleryByUsernameParamsType) {
    const user = await this.getByUsername(username);

    if (!user) {
      throw new NotFound();
    }

    return user.gallery;
  }

  async getFavoritesByUsername({username}: GetFavoritesByUsernameParamsType) {
    const user = await this.databaseService.user.findUnique({
      where: {username},
      include: {
        favorites: {
          select: {
            photo: {
              select: {
                url: true,
                id: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFound();
    }

    if (user.favoritesPrivate) {
      throw new Unauthorized(
        `Las fotos favoritas de @${username} son privadas`,
      );
    }

    return user.favorites;
  }

  async getUserByUsername({username}: GetUserByUsernameParamsType) {
    const user = await this.getByUsername(username);

    if (!user) {
      throw new NotFound();
    }

    const {password, refreshToken, resetPasswordToken, ...restOfUser} = user;

    return {
      ...restOfUser,
      favoritesCount: restOfUser.favorites.length,
      photosCount: restOfUser.photos.length,
      galleryCount: restOfUser.gallery.length,
    };
  }

  async count() {
    return this.databaseService.user.count();
  }

  async getByEmail(email: string) {
    return this.databaseService.user.findUnique({where: {email}});
  }

  async getById(id: string) {
    return this.databaseService.user.findUnique({where: {id}});
  }

  async changeUserDescription(
    userId: string,
    {description}: ChangeUserDescriptionParamsType,
  ) {
    const user = await this.getByIdOrThrow(userId);

    await this.databaseService.user.update({
      where: {
        id: user.id,
      },
      data: {
        description,
      },
    });

    return {
      success: true,
      description,
    };
  }

  async getByIdOrThrow(id: string) {
    const user = await this.getById(id);

    if (!user) {
      throw new Unauthorized();
    }

    return user;
  }

  async updatePassword(id: string, password: string) {
    return this.databaseService.user.update({
      where: {id},
      data: {password},
    });
  }

  async updateResetPasswordToken(
    id: string,
    resetPasswordToken: string | null,
  ) {
    return this.databaseService.user.update({
      where: {id},
      data: {resetPasswordToken},
    });
  }

  async updateRefreshToken(id: string, refreshToken: string | null) {
    return this.databaseService.user.update({
      where: {id},
      data: {refreshToken},
    });
  }

  async create(data: CreateBodyType) {
    const [address, email, name, birthDate, username] = trimStrings(
      data.address,
      data.email,
      data.name,
      data.birthDate,
      data.username,
    );

    const foundUser = await this.getByUsername(username);

    if (foundUser) {
      throw new BadRequest('account_taken');
    }

    if (!this.passwordService.isValidPassword(data.password)) {
      throw new BadRequest('invalid_password');
    }

    const hashedPassword = await this.passwordService.hash(data.password);

    return this.databaseService.user.create({
      data: {
        username,
        description: data.description,
        address,
        birthDate: new Date(birthDate),
        email,
        name,
        password: hashedPassword,
      },
    });
  }

  async getMostActiveUsers(take: number = 10) {
    return this.databaseService.user.findMany({
      orderBy: {
        createdAt: 'desc',
        photos: {
          _count: 'desc',
        },
      },
      select: {
        address: false,
        birthDate: false,
        comments: false,
        createdAt: false,
        description: true,
        email: false,
        favorites: false,
        password: false,
        gallery: false,
        name: true,
        photoRankings: false,
        photos: true,
        refreshToken: false,
        resetPasswordToken: false,
        updatedAt: false,
        username: true,
        id: true,
      },
      take,
    });
  }
}
