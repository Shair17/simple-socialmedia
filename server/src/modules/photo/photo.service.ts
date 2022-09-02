import {Service} from 'fastify-decorators';
import {DatabaseService} from '../../database/DatabaseService';
import {UserService} from '../user/user.service';
import {
  DeletePhotoParamsType,
  GetPhotoParamsType,
  UploadImageBodyType,
} from './photo.schema';
import {NotFound, Unauthorized, InternalServerError} from 'http-errors';
import {PhotoRanking} from '@prisma/client';
import {CloudinaryService} from '../../shared/services/cloudinary.service';
import {CreateCommentBodyType} from './photo.schema';

@Service('PhotoServiceToken')
export class PhotoService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly userService: UserService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async uploadPhoto(
    userId: string,
    {title, description, filename, image}: UploadImageBodyType,
  ) {
    try {
      const user = await this.userService.getByIdOrThrow(userId);
      const uploadedImage = await this.cloudinaryService.upload(image);
      const photo = await this.databaseService.photo.create({
        data: {
          title,
          description,
          filename,
          url: uploadedImage.secure_url,
          cloudinaryPublicId: uploadedImage.public_id,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      return {
        status: true,
        photo,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerError();
    }
  }

  async getPhotoCountByUserId(userId: string): Promise<number> {
    return this.databaseService.photo.count({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  async getPhotoById(id: string) {
    return this.databaseService.photo.findUnique({where: {id}});
  }

  async getPhotoByIdOrThrow(id: string) {
    const photo = await this.databaseService.photo.findUnique({
      where: {id},
      include: {
        user: true,
        comments: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!photo) {
      throw new NotFound();
    }

    const {comments: _comments, user, ...restOfPhoto} = photo;

    const comments = _comments.map(
      ({user: {name, username}, ...restOfComment}) => ({
        ...restOfComment,
        user: {
          name,
          username,
        },
      }),
    );

    const response = {
      ...restOfPhoto,
      comments,
      user: {name: user?.name, username: user?.username},
    };

    return response;
  }

  async getPhoto({id}: GetPhotoParamsType) {
    return this.getPhotoByIdOrThrow(id);
  }

  // TODO: aplicar paginacion
  async getPhotos() {
    const photos = await this.databaseService.photo.findMany({
      include: {user: true, rankings: true},
    });

    return photos.map(({user, rankings, ...restOfPhoto}) => ({
      ...restOfPhoto,
      score: this.calcPhotoRanking(rankings),
      user: {
        name: user?.name,
        username: user?.username,
      },
    }));
  }

  async createComment(
    userId: string,
    {photoId, comment}: CreateCommentBodyType,
  ) {
    const [user, photo] = await Promise.all([
      this.userService.getByIdOrThrow(userId),
      this.getPhotoByIdOrThrow(photoId),
    ]);

    const _createdComment = await this.databaseService.comment.create({
      data: {
        comment,
        photo: {
          connect: {
            id: photo.id,
          },
        },
        user: {
          connect: {
            id: user.id,
          },
        },
      },
      include: {
        user: true,
      },
    });

    const {user: userComment, ...restOfComment} = _createdComment;

    return {
      status: true,
      success: true,
      comment: {
        ...restOfComment,
        user: {
          name: userComment.name,
          username: userComment.username,
        },
      },
    };
  }

  async deletePhoto(userId: string, {id: photoId}: DeletePhotoParamsType) {
    const user = await this.userService.getByIdOrThrow(userId);
    const photo = await this.getPhotoByIdOrThrow(photoId);

    if (user.id !== photo.userId) {
      throw new Unauthorized();
    }

    try {
      // TODO: eliminar la foto en cloudinary tambien
      await this.databaseService.photo.delete({where: {id: photo.id}});
    } catch (error) {
      console.log(error);

      throw new InternalServerError();
    }

    return {
      success: true,
    };
  }

  calcPhotoRanking(rankings: PhotoRanking[]) {
    let suma = 0;
    let items: number[] = [];

    if (!rankings || rankings.length === 0) return suma;

    /**
     * Aplicamos el algoritmo Quick Sort para ordernar
     * las calificaciones de las fotos
     */
    for (const ranking of rankings) {
      items.push(ranking.value);
    }

    const calificacionesOrdenadas = this.quickSort(items, 0, items.length - 1);

    for (const calificacion of calificacionesOrdenadas) {
      suma += calificacion;
    }

    return Math.round(suma / rankings.length);
  }

  // Método de ayuda para quick sort
  partition(items: number[], left: number, right: number) {
    let pivot = items[Math.floor((right + left) / 2)];
    let i = left;
    let j = right;

    while (i <= j) {
      while (items[i] < pivot) {
        i++;
      }
      while (items[j] > pivot) {
        j--;
      }
      if (i <= j) {
        let temp = items[i];
        items[i] = items[j];
        items[j] = temp;
        i++;
        j--;
      }
    }
    return i;
  }

  // Declaración del algoritmo de QuickSort
  quickSort(items: number[], left: number, right: number) {
    let index: number;

    if (items.length > 1) {
      index = this.partition(items, left, right);
      if (left < index - 1) {
        this.quickSort(items, left, index - 1);
      }
      if (index < right) {
        this.quickSort(items, index, right);
      }
    }
    return items;
  }
}
