export type AuthTokenPayload = {
  id: string;
  email: string;
  name: string;
  username: string;
};

export type ForgotPasswordTokenPayload = {
  id: string;
  email: string;
  name: string;
  username: string;
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};
