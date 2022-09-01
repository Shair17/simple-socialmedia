import {Type, Static} from '@sinclair/typebox';
import {PASSWORD_REGEX, USERNAME_REGEX} from '../../constants/regex';

export const GetPhotosByUsernameParams = Type.Object({
  username: Type.RegEx(USERNAME_REGEX),
});
export type GetPhotosByUsernameParamsType = Static<
  typeof GetPhotosByUsernameParams
>;

export const GetGalleryByUsernameParams = Type.Object({
  username: Type.RegEx(USERNAME_REGEX),
});
export type GetGalleryByUsernameParamsType = Static<
  typeof GetGalleryByUsernameParams
>;

export const GetFavoritesByUsernameParams = Type.Object({
  username: Type.RegEx(USERNAME_REGEX),
});
export type GetFavoritesByUsernameParamsType = Static<
  typeof GetFavoritesByUsernameParams
>;

export const GetUserByUsernameParams = Type.Object({
  username: Type.RegEx(USERNAME_REGEX),
});
export type GetUserByUsernameParamsType = Static<
  typeof GetUserByUsernameParams
>;

export const GetParams = Type.Object({
  id: Type.String({format: 'uuid'}),
});
export type GetParamsType = Static<typeof GetParams>;

export const CreateBody = Type.Object(
  {
    name: Type.String({minLength: 5}),
    username: Type.RegEx(USERNAME_REGEX),
    email: Type.String({format: 'email'}),
    password: Type.RegEx(PASSWORD_REGEX),
    address: Type.String({minLength: 5}),
    description: Type.Optional(Type.String()),
    birthDate: Type.String({format: 'date-time'}),
  },
  {
    additionalProperties: false,
  },
);
export type CreateBodyType = Static<typeof CreateBody>;

export const EditParams = Type.Object({
  id: Type.String({format: 'uuid'}),
});
export type EditParamsType = Static<typeof EditParams>;

export const EditBody = Type.Object(
  {
    name: Type.String({minLength: 5}),
    email: Type.String({format: 'email'}),
    username: Type.RegEx(USERNAME_REGEX),
    password: Type.RegEx(PASSWORD_REGEX),
    address: Type.String({minLength: 5}),
    description: Type.Optional(Type.String()),
    birthDate: Type.String({format: 'date-time'}),
  },
  {
    additionalProperties: false,
  },
);
export type EditAdminBodyType = Static<typeof EditBody>;

export const DeleteParams = Type.Object({
  id: Type.String({format: 'uuid'}),
});
export type DeleteParamsType = Static<typeof DeleteParams>;
