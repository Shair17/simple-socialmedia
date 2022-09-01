import {
  AuthModule,
  UserModule,
  PhotoModule,
  GalleryModule,
  FeedModule,
} from './modules';

export const AppModule = [
  ...AuthModule,
  ...UserModule,
  ...PhotoModule,
  ...GalleryModule,
  ...FeedModule,
];
