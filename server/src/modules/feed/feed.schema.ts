import {Type, Static} from '@sinclair/typebox';

export const GetUsersQueryString = Type.Object({
  take: Type.Optional(Type.Number({minimum: 0})),
});
export type GetUsersQueryStringType = Static<typeof GetUsersQueryString>;

export const GetPhotosQueryString = Type.Object({
  skip: Type.Optional(Type.Number({minimum: 0})),
  take: Type.Optional(Type.Number({minimum: 0})),
  orderBy: Type.Union([Type.Literal('asc'), Type.Literal('desc')]),
});
export type GetPhotosQueryStringType = Static<typeof GetPhotosQueryString>;
