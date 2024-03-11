import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigurationModule } from './configuration/configuration.module';
import { ContactModule } from './contact/contact.module';
import { RequestValidationMiddleware } from './requestValidation.middleware';

// Supposons que vous vouliez passer des options à ConfigurationModule.register
const options = {}; // Définir des options selon vos besoins

@Module({
  imports: [ConfigurationModule.register(options), ContactModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {configure(consumer: MiddlewareConsumer) {
  consumer.apply(RequestValidationMiddleware).forRoutes(AppController);
}
}
