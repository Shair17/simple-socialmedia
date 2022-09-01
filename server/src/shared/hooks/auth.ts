import {onRequestHookHandler} from 'fastify';
import {getInstanceByToken} from 'fastify-decorators';
import {UserService} from '../../modules/user/user.service';
import {BEARER_SCHEME_REGEX} from '../../constants/regex';
import {Unauthorized} from 'http-errors';
import * as jwt from 'jsonwebtoken';

export const hasBearerToken: onRequestHookHandler = async (request, reply) => {
  const {authorization} = request.headers;
  let token: string;

  // TODO: Validar que el token tenga un formato válido
  if (!!authorization) {
    const parts = authorization.split(' ');

    if (parts.length === 2 && parts[1].split('.').length === 3) {
      const scheme = parts[0];
      token = parts[1];

      if (!BEARER_SCHEME_REGEX.test(scheme)) {
        throw new Unauthorized('malformed_token');
      }
    } else {
      throw new Unauthorized('malformed_token');
    }
  } else {
    throw new Unauthorized('token_not_provided');
  }

  const decoded = jwt.decode(token) as jwt.JwtPayload;

  if (!decoded) {
    throw new Unauthorized(`malformed_token`);
  }

  if (new Date(decoded.exp! * 1000) < new Date()) {
    throw new Unauthorized(`token_expired`);
  }
};

export const IsAuthenticated: onRequestHookHandler = async (request, reply) => {
  try {
    const token = request.headers.authorization?.split(' ')[1];

    const decoded = jwt.verify(token!, process.env.JWT_USER_SECRET!) as {
      id: string;
    };

    const userService = getInstanceByToken<UserService>('UserServiceToken');
    const user = await userService.getByIdOrThrow(decoded.id);

    request.userId = user.id;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Unauthorized(`token_expired`);
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Unauthorized(`invalid_token`);
    }

    throw new Unauthorized();
  }
};
