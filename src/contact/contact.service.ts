import { Injectable, NotFoundException } from '@nestjs/common';
import { Contact } from './model/Contact';
import * as fs from 'fs';

@Injectable()
export class ContactService {
  private contacts: Contact[] = [];
  private filePath = 'contacts.json';

  constructor() {
    this.loadContacts(); 
  }

  private loadContacts(): void {
    try {
      const rawData = fs.readFileSync(this.filePath);
      this.contacts = JSON.parse(rawData.toString());
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  }

  private saveContactsToFile(): void {
    fs.writeFileSync(this.filePath, JSON.stringify(this.contacts, null, 2));
  }

  createContact(contactData: Contact): Contact {
    const newContact: Contact = {
      id: this.generateNewId(),
      ...contactData,
    };
    this.contacts.push(newContact);
    this.saveContactsToFile();
    return newContact;
  }

  getContacts(): Contact[] {
    return this.contacts;
  }

  getContactById(id: number): Contact {
    this.loadContacts();
    const contact = this.contacts.find(c => c.id === id);
    if (!contact) {
      throw new NotFoundException(`Contact with id ${id} not found`);
    }
    return contact;
  }

  updateContact(id: number, updatedContact: Contact): Contact {
    this.loadContacts(); // Assurez-vous de charger les contacts avant de mettre à jour
    const index = this.contacts.findIndex(c => c.id === id);
    if (index === -1) {
        throw new NotFoundException(`Contact with id ${id} not found`);
    }
    this.contacts[index] = { ...this.contacts[index], ...updatedContact };
    this.saveContactsToFile();
    return this.contacts[index];
}

  deleteContact(id: number): void {
    const index = this.contacts.findIndex(c => c.id === id);
    if (index === -1) {
      throw new NotFoundException(`Contact with id ${id} not found`);
    }
    this.contacts.splice(index, 1);
    this.saveContactsToFile();
  }

  private generateNewId(): number {
    const maxId = Math.max(...this.contacts.map(contact => contact.id), 0);
    return maxId + 1;
  }
}