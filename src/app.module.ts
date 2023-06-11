import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { AppService } from './app.service';
import { ProxyController } from './proxy.controller';

@Module({
  imports: [],
  controllers: [ProxyController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(json(), urlencoded({ extended: true }))
      .exclude('proxy/(.*)')
      .forRoutes('*');
  }
}
