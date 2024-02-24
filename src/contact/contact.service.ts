import { Injectable } from '@nestjs/common';
import { Contact } from './model/contact';

@Injectable()
export class ContactService {
  private contacts: Contact[] = []; // Simulez une source de données, par exemple une liste en mémoire

  createContact(contactData: Contact): Contact {
    const newContact: Contact = {
      id: this.contacts.length + 1, // Générez un nouvel identifiant pour le contact
      ...contactData,
    };
    this.contacts.push(newContact); // Ajoutez le nouveau contact à la liste
    return newContact;
  }

  getContacts(): Contact[] {
    return this.contacts; // Renvoyez tous les contacts
  }
}