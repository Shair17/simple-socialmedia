import 'reflect-metadata';

import type {Server as IServer, IncomingMessage, ServerResponse} from 'http';
import Fastify, {
  FastifyServerOptions,
  FastifyInstance,
  FastifyLoggerInstance,
} from 'fastify';
import {bootstrap} from 'fastify-decorators';
import {resolve} from 'path';
import Env from '@fastify/env';
import Compress from '@fastify/compress';
import Helmet from '@fastify/helmet';
import Cors from '@fastify/cors';
import Static from '@fastify/static';
import Favicon from 'fastify-favicon';
import Routes from '@fastify/routes';
import RateLimit from '@fastify/rate-limit';
import FileUpload from 'fastify-file-upload';
import {ConfigSchema} from './config/config.schema';
import {AppModule} from './app.module';

declare module 'fastify' {
  interface FastifyRequest {
    userId: string;
  }
}

export default async function Server(
  opts?: FastifyServerOptions,
): Promise<
  FastifyInstance<
    IServer,
    IncomingMessage,
    ServerResponse,
    FastifyLoggerInstance
  >
> {
  const server: FastifyInstance = Fastify(opts);
  const publicDir = resolve(__dirname, '../public');

  server.log.info(
    `Starting server application at ${new Date().toLocaleString()}`,
  );

  server.register(Env, {
    dotenv: {
      path: resolve(__dirname, '../.env'),
      debug: false,
    },
    confKey: 'config',
    schema: ConfigSchema,
  });
  server.register(RateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });
  server.register(Cors);
  server.register(Compress);
  server.register(Helmet, {
    global: true,
    hidePoweredBy: true,
  });
  server.register(FileUpload);
  server.register(Routes);
  server.register(Static, {
    root: publicDir,
  });
  server.register(Favicon, {
    path: publicDir,
    name: 'favicon.ico',
  });
  server.register(bootstrap, {
    controllers: [...AppModule],
  });

  return server;
}
