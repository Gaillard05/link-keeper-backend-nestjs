import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContactModule } from './contact/contact.module';
import { ConfigurationModule } from './configuration/configuration.module';

@Module({
  imports: [
    ContactModule,
    ConfigurationModule.register({
      databaseHost: 'localhost',
      databasePort: 5432,
      // Autres options de configuration de la base de données...
    }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
