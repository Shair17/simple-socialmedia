import type {FastifyRequest as Request, FastifyReply as Reply} from 'fastify';
import {Controller, POST} from 'fastify-decorators';
import {AuthService} from './auth.service';
import {hasBearerToken, IsAuthenticated} from '../../shared/hooks/auth';
import {
  Login,
  Register,
  LoginType,
  RegisterType,
  ChangePassword,
  ChangePasswordType,
  ForgotPassword,
  ForgotPasswordType,
  NewPassword,
  NewPasswordType,
  RefreshToken,
  RefreshTokenType,
} from './auth.schema';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @POST('/login', {
    schema: {
      body: Login,
    },
  })
  async logIn(
    request: Request<{
      Body: LoginType;
    }>,
    reply: Reply,
  ) {
    return this.authService.logIn(request.body);
  }

  @POST('/register', {
    schema: {
      body: Register,
    },
  })
  async register(
    request: Request<{
      Body: RegisterType;
    }>,
    reply: Reply,
  ) {
    return this.authService.register(request.body);
  }

  @POST('/forgot-password', {
    schema: {
      body: ForgotPassword,
    },
  })
  async forgotPassword(
    request: Request<{
      Body: ForgotPasswordType;
    }>,
    reply: Reply,
  ) {
    return this.authService.forgotPassword(request.body);
  }

  @POST('/new-password', {
    schema: {
      body: NewPassword,
    },
  })
  async newPassword(
    request: Request<{
      Body: NewPasswordType;
    }>,
    reply: Reply,
  ) {
    return this.authService.newPassword(request.body);
  }

  @POST('/change-password', {
    schema: {
      body: ChangePassword,
    },
    onRequest: [hasBearerToken, IsAuthenticated],
  })
  async changePassword(
    request: Request<{
      Body: ChangePasswordType;
    }>,
    reply: Reply,
  ) {
    return this.authService.changePassword(request.userId, request.body);
  }

  @POST('/refresh', {
    schema: {
      body: RefreshToken,
    },
  })
  async refreshToken(
    request: Request<{
      Body: RefreshTokenType;
    }>,
    reply: Reply,
  ) {
    return this.authService.refreshToken(request.body);
  }

  @POST('/logout', {
    onRequest: [hasBearerToken, IsAuthenticated],
  })
  async logOut(request: Request, reply: Reply) {
    // TODO: test this
    reply.removeHeader('authorization');
    return this.authService.logOut(request.userId);
  }
}
