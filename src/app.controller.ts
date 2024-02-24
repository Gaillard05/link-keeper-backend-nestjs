import { Controller, Get, Post, Body } from '@nestjs/common';
import { ConfigurationService } from './configuration/configuration.service';
import { AppService } from './app.service';
import { Contact } from './contact/model/Contact';
import { ContactService } from './contact/contact.service';

@Controller()
export class AppController {
  constructor(
    private appService: AppService,
    private configService: ConfigurationService,
    private contactService: ContactService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('environment')
  getEnvironment(): string | number {
    return this.configService.getValue('environment');
  }

  @Post('contacts')
  async addContact(@Body() contactData: Contact): Promise<Contact> {
    const newContact = this.contactService.createContact(contactData);
    return newContact;
  }

  @Get('listContacts')
  getContacts(): Contact[] {
    return this.contactService.getContacts();
  }
}