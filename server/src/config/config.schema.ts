import {Type, Static} from '@sinclair/typebox';

export const ConfigSchema = Type.Strict(
  Type.Object(
    {
      PORT: Type.Number(),
			DATABASE_URL: Type.String(),
			MAILER_TRANSPORTER_HOST: Type.String(),
			MAILER_TRANSPORTER_PORT: Type.Number(),
			MAILER_TRANSPORTER_SECURE: Type.Boolean(),
			MAILER_TRANSPORTER_USER: Type.String(),
			MAILER_TRANSPORTER_PASS: Type.String(),
			JWT_USER_SECRET: Type.String(),
			JWT_USER_SECRET_EXPIRES_IN: Type.String(),
			JWT_USER_REFRESH_SECRET: Type.String(),
			JWT_USER_REFRESH_SECRET_EXPIRES_IN: Type.String(),
			JWT_FORGOT_USER_PASSWORD_SECRET: Type.String(),
			JWT_FORGOT_USER_PASSWORD_SECRET_EXPIRES_IN: Type.String(),
			 CLOUDINARY_CLOUD_NAME: Type.String(),
			 CLOUDINARY_API_KEY: Type.String(),
			CLOUDINARY_API_SECRET: Type.String(),
    },
    {
      additionalProperties: false,
    },
  ),
);
export type ConfigSchemaType = Static<typeof ConfigSchema>;
