import {Service} from 'fastify-decorators';
import {Unauthorized, InternalServerError} from 'http-errors';
import {ConfigService} from '../../config/config.service';
import {JwtService, JsonWebTokenError, TokenExpiredError} from './jwt.service';
import {
  AuthTokenPayload,
  ForgotPasswordTokenPayload,
  Tokens,
} from './token.type';

@Service('TokenServiceToken')
export class TokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  generateForgotPasswordToken(payload: ForgotPasswordTokenPayload) {
    return this.jwtService.sign(
      payload,
      this.configService.getOrThrow<string>('JWT_FORGOT_USER_PASSWORD_SECRET'),
      {
        expiresIn: this.configService.getOrThrow<string>(
          'JWT_FORGOT_USER_PASSWORD_SECRET_EXPIRES_IN',
        ),
      },
    );
  }

  verifyRefreshToken(refreshToken: string) {
    try {
      return <AuthTokenPayload>(
        this.jwtService.verify(
          refreshToken,
          this.configService.getOrThrow<string>('JWT_USER_REFRESH_SECRET'),
        )
      );
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new Unauthorized(`token_expired`);
      }

      if (error instanceof JsonWebTokenError) {
        throw new Unauthorized(`invalid_token`);
      }

      throw new InternalServerError();
    }
  }

  verifyForgotPasswordToken(resetPasswordToken: string) {
    try {
      return <ForgotPasswordTokenPayload>(
        this.jwtService.verify(
          resetPasswordToken,
          this.configService.getOrThrow<string>(
            'JWT_FORGOT_USER_PASSWORD_SECRET',
          ),
        )
      );
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new Unauthorized(`token_expired`);
      }

      if (error instanceof JsonWebTokenError) {
        throw new Unauthorized(`invalid_token`);
      }

      throw new InternalServerError();
    }
  }

  generateAccessToken(payload: AuthTokenPayload): string {
    return this.jwtService.sign(
      payload,
      this.configService.getOrThrow<string>('JWT_USER_SECRET'),
      {
        expiresIn: this.configService.getOrThrow<string>(
          'JWT_USER_SECRET_EXPIRES_IN',
        ),
      },
    );
  }

  generateRefreshToken(payload: AuthTokenPayload): string {
    return this.jwtService.sign(
      payload,
      this.configService.getOrThrow<string>('JWT_USER_REFRESH_SECRET'),
      {
        expiresIn: this.configService.getOrThrow<string>(
          'JWT_USER_REFRESH_SECRET_EXPIRES_IN',
        ),
      },
    );
  }

  generateTokens(payload: AuthTokenPayload): Tokens {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }
}
