import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  home(): string {
    return 'Bienvenue dans Link-keeper';
  }
}
