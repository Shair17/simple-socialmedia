import {FastifyInstance} from 'fastify';
import {
  Service,
  FastifyInstanceToken,
  getInstanceByToken,
} from 'fastify-decorators';
import {ConfigSchemaType} from './config.schema';

declare module 'fastify' {
  interface FastifyInstance {
    config: ConfigSchemaType;
  }
}

type Config = string | number | boolean;
type ConfigKey = keyof ConfigSchemaType;
type ConfigKeyOrString = ConfigKey | string;

@Service('ConfigServiceToken')
export class ConfigService {
  private readonly fastify =
    getInstanceByToken<FastifyInstance>(FastifyInstanceToken);

  configExists(key: ConfigKey): boolean {
    return !!this.fastify.config[key];
  }

  set(key: ConfigKeyOrString, value: Config, overwrite: boolean = false): void {
    if (this.configExists(key as ConfigKey) && !overwrite) {
      throw new Error(
        `Config with key ${key} already exists. Please set overwrite param to true to overwrite.`,
      );
    }

    if (this.configExists(key as ConfigKey) && overwrite) {
      // @ts-ignore
      this.fastify.config[key] = value;

      return;
    }

    // @ts-ignore
    this.fastify.config[key] = value;

    return;
  }

  get<T = any>(key: ConfigKey): T {
    // @ts-ignore
    return this.fastify.config[key];
  }

  getOrThrow<T>(key: ConfigKey): T {
    if (!this.configExists(key)) {
      throw new Error(`Config with key ${key} doesn't exists.`);
    }

    return this.get(key);
  }
}
