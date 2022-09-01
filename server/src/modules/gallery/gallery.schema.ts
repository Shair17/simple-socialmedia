import { Static, Type } from '@sinclair/typebox';

export const GetGalleryParams = Type.Object({
	id: Type.String({ format: 'uuid' }),
});
export type GetGalleryParamsType = Static<typeof GetGalleryParams>;
