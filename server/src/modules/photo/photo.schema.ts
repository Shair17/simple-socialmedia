import {Type, Static} from '@sinclair/typebox';

export const CreateCommentBody = Type.Object({
  photoId: Type.String({format: 'uuid'}),
  comment: Type.String(),
});
export type CreateCommentBodyType = Static<typeof CreateCommentBody>;

export const UploadImageBody = Type.Object({
  filename: Type.String(),
  title: Type.String(),
  description: Type.String(),
  image: Type.String(),
});
export type UploadImageBodyType = Static<typeof UploadImageBody>;

export const GetPhotoParams = Type.Object({
  id: Type.String({format: 'uuid'}),
});
export type GetPhotoParamsType = Static<typeof GetPhotoParams>;

export const DeletePhotoParams = Type.Object({
  id: Type.String({format: 'uuid'}),
});
export type DeletePhotoParamsType = Static<typeof DeletePhotoParams>;
