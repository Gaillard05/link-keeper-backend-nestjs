import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';

@Module({
  exports: [ContactService],
  providers: [ContactService],
})
export class ContactModule {}