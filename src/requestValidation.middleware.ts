import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';

@Injectable()
export class RequestValidationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Lire le fichier JSON des contacts
    let contacts = [];
    try {
      const rawData = fs.readFileSync('contacts.json', 'utf-8');
      contacts = JSON.parse(rawData);
    } catch (error) {
      console.error('Erreur lors de la lecture du fichier JSON des contacts :', error);
    }

    // Vérifier si la méthode de la requête est POST
    if (req.method === 'POST') {
      // Vérifier si la requête contient le corps (body)
      if (!req.body) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: 'Requête invalide',
          message: 'Le corps de la requête est manquant',
        });
      }

      // Vérifier si l'ID existe déjà dans le fichier JSON
      const { id } = req.body;
      if (contacts.some(contact => contact.id === id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: 'Requête invalide',
          message: 'Un contact avec cet ID existe déjà',
        });
      }

      // Vérifier si les données requises sont présentes dans le corps de la requête
      const { name, telephone } = req.body;
      if (!name || !telephone) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: 'Requête invalide',
          message: 'Le nom et le numéro de téléphone sont requis',
        });
      }

      // Vérifier si les champs requis ne sont pas vides
      if (name.trim() === '' || telephone.trim() === '') {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: 'Requête invalide',
          message: 'Le nom et le numéro de téléphone ne peuvent pas être vides',
        });
      }

      // Vérifier la longueur du nom (par exemple, supposons que le nom doit avoir au moins 3 caractères)
      if (name.length < 3) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: 'Requête invalide',
          message: 'Le nom doit comporter au moins 3 caractères',
        });
      }

      // Vérifier le format du numéro de téléphone
      const phoneNumberRegex = /^\d{2}\.\d{2}\.\d{2}\.\d{2}\.\d{2}$/; // Format xx.xx.xx.xx.xx
      if (!phoneNumberRegex.test(telephone)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: 'Requête invalide',
          message: 'Le numéro de téléphone doit être au format xx.xx.xx.xx.xx',
        });
      }

      // Vérifier si un contact avec le même numéro de téléphone existe déjà
      const existingContact = contacts.find(contact => contact.telephone === telephone);
      if (existingContact) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: 'Requête invalide',
          message: 'Un contact avec ce numéro de téléphone existe déjà',
        });
      }
    }

    // Vérifier si la méthode de la requête est PUT
    if (req.method === 'PUT') {
      // Vérifier si la requête contient le corps (body)
      if (!req.body) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: 'Requête invalide',
          message: 'Le corps de la requête est manquant',
        });
      }
      // Récupérer l'ID du contact à mettre à jour depuis les paramètres de la requête
      const { id } = req.params;

      // Vérifier si l'ID à mettre à jour existe dans le fichier JSON
      const existingContact = contacts.find(contact => contact.id === +id);
      if (!existingContact) {
        return res.status(HttpStatus.NOT_FOUND).json({
          error: 'Requête invalide',
          message: `Aucun contact avec l'ID ${id} trouvé`,
        });
      }

      // Vérifier si le nouvel ID existe déjà dans le fichier JSON
      const { newId } = req.body;
      if (newId && contacts.some(contact => contact.id === newId && contact.id !== +id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: 'Requête invalide',
          message: 'Un contact avec cet ID existe déjà',
        });
      }
    
      // Vérifier si le numéro de téléphone à mettre à jour est déjà utilisé par un autre contact
      const { telephone } = req.body;
      const existingContactWithSameTelephone = contacts.find(contact => contact.telephone === telephone && contact.id !== +id);
      if (existingContactWithSameTelephone) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: 'Requête invalide',
          message: 'Un contact avec ce numéro de téléphone existe déjà',
        });
      }

       // Vérifier si les données modifiées ne sont pas vides
      const { name } = req.body;
      if (name === "" || telephone === "") {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: 'Requête invalide',
          message: 'Le nom et le numéro de téléphone ne peuvent pas être vides',
        });
      }

    }
    // Si la méthode de la requête n'est pas POST ou si toutes les vérifications sont réussies, passer au middleware suivant
    next();
  }
}