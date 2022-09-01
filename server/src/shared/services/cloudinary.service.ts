import {Initializer, Service} from 'fastify-decorators';
import cloudinary from 'cloudinary';
import {ConfigService} from '../../config/config.service';
import type {OnModuleInit} from '../../interfaces/module';

@Service('CloudinaryServiceToken')
export class CloudinaryService implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  @Initializer()
  onModuleInit(): void {
    cloudinary.v2.config({
      cloud_name: this.configService.getOrThrow<string>(
        'CLOUDINARY_CLOUD_NAME',
      ),
      api_key: this.configService.getOrThrow<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.getOrThrow<string>(
        'CLOUDINARY_API_SECRET',
      ),
      secure: true,
    });
  }

  async upload(
    image: string,
    filename?: string,
  ): Promise<cloudinary.UploadApiResponse> {
    return cloudinary.v2.uploader.upload(image, {
      folder: 'eaproject',
      filename_override: filename,
    });
  }

  async destroy(public_id: string) {
    return cloudinary.v2.uploader.destroy(public_id);
  }
}
