import {Static, Type} from '@sinclair/typebox';
import {PASSWORD_REGEX, USERNAME_REGEX, JWT_REGEX} from '../../constants/regex';

export const Login = Type.Object(
  {
    username: Type.RegEx(USERNAME_REGEX),
    password: Type.RegEx(PASSWORD_REGEX),
  },
  {
    additionalProperties: false,
  },
);
export type LoginType = Static<typeof Login>;

export const Register = Type.Object(
  {
    name: Type.String({minLength: 5}),
    email: Type.String({format: 'email'}),
    username: Type.RegEx(USERNAME_REGEX),
    password: Type.RegEx(PASSWORD_REGEX),
    description: Type.Optional(Type.String()),
    address: Type.String({minLength: 5}),
    birthDate: Type.String({format: 'date-time'}),
  },
  {
    additionalProperties: false,
  },
);
export type RegisterType = Static<typeof Register>;
export const ForgotPassword = Type.Object({
  // email: Type.String({ format: 'email' }),
  username: Type.RegEx(USERNAME_REGEX),
});
export type ForgotPasswordType = Static<typeof ForgotPassword>;
export const NewPassword = Type.Object({
  newPassword: Type.RegEx(PASSWORD_REGEX),
  resetPasswordToken: Type.RegEx(JWT_REGEX),
});
export type NewPasswordType = Static<typeof NewPassword>;
export const ChangePassword = Type.Object(
  {
    oldPassword: Type.RegEx(PASSWORD_REGEX),
    newPassword: Type.RegEx(PASSWORD_REGEX),
  },
  {
    additionalProperties: false,
  },
);
export type ChangePasswordType = Static<typeof ChangePassword>;
export const RefreshToken = Type.Object({
  refreshToken: Type.RegEx(JWT_REGEX),
});
export type RefreshTokenType = Static<typeof RefreshToken>;
