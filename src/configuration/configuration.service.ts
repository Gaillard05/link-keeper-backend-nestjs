import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigurationService {
  constructor(private options: Record<string, string | number>) {}

  getValue(key: string | number ): string | number {
    return this.options[key];
  }
}