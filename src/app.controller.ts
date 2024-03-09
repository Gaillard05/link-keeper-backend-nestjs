import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import * as fs from 'fs';
import { Contact } from './contact/model/Contact';
import { ContactService } from './contact/contact.service';
import { AppService } from './app.service';
import { ConfigurationService } from './configuration/configuration.service';

@Controller()
export class AppController {
  constructor( 
    private appService: AppService,
    private configService: ConfigurationService,
    private contactService: ContactService,
    ) {}


  private contacts: Contact[] = [];

  private loadContacts(): void {
    const rawData = fs.readFileSync('contacts.json');
    this.contacts = JSON.parse(rawData.toString());
  }

  private saveContactsToFile(): void {
    fs.writeFileSync('contacts.json', JSON.stringify(this.contacts, null, 2));
  }

  private getNextID(): number {
    const maxId = Math.max(...this.contacts.map(contact => contact.id), 0);
    return maxId + 1; // retourne l'ID suivant
  }

  @Get()
  getHome(): string {
    return this.appService.home();
  }

  @Get('contact/:id')
  getContactById(@Param('id') id: number): Contact {
    return this.contactService.getContactById(+id);
  }
  
  @Get('contacts')
  getContacts(): Contact[] {
    this.loadContacts(); // Charger les contacts à partir du fichier JSON
    return this.contacts;
  }

  @Post('contact')
  async addContact(@Body() contactData: Contact): Promise<Contact> {
    this.loadContacts(); // Charger les contacts à partir du fichier JSON
    const newContact = { id: this.getNextID(), ...contactData }; // Insérer l'ID en premier
    this.contacts.push(newContact); // Ajouter le nouveau contact à la liste en mémoire
    this.saveContactsToFile(); // Enregistrer les contacts dans le fichier JSON
    return newContact;
  }

  @Put('contact/:id')
  async updateContact(@Param('id') id: number, @Body() contactData: Contact): Promise<Contact> {
    this.loadContacts(); // Charger les contacts à partir du fichier JSON
    const updatedContact = this.contactService.updateContact(+id, contactData);
    this.saveContactsToFile(); // Enregistrer les contacts dans le fichier JSON
    return updatedContact;
  }

  @Delete('contact/:id')
  deleteContact(@Param('id') id: number): void {
    this.contactService.deleteContact(+id);
  }
}