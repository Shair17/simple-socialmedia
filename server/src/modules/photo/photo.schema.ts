import { Type, Static } from '@sinclair/typebox';

export const GetPhotoParams = Type.Object({
	id: Type.String({ format: 'uuid' }),
});
export type GetPhotoParamsType = Static<typeof GetPhotoParams>;

export const DeletePhotoParams = Type.Object({
	id: Type.String({ format: 'uuid' }),
});
export type DeletePhotoParamsType = Static<typeof DeletePhotoParams>;
