import {Service, Initializer, Destructor} from 'fastify-decorators';
import {PrismaClient} from '@prisma/client';
import type {OnModuleDestroy, OnModuleInit} from '../interfaces/module';
import {LoggerService} from '../shared/services/logger.service';

@Service('DatabaseServiceToken')
export class DatabaseService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly loggerService: LoggerService) {
    super();
  }

  @Initializer()
  async onModuleInit() {
    let startTime = Date.now();
    await this.$connect();
    let endTime = Date.now();

    this.loggerService.info(
      `Prisma Module has established the connection to the database and it took ${Math.floor(
        endTime - startTime,
      )}ms`,
    );
  }

  @Destructor()
  async onModuleDestroy() {
    let startTime = Date.now();
    await this.$disconnect();
    let endTime = Date.now();

    this.loggerService.info(
      `Prisma Module has been disconnected from the database and it took ${Math.floor(
        endTime - startTime,
      )}ms`,
    );
  }
}
