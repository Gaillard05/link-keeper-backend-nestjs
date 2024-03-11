import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';

@Injectable()
export class RequestValidationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Vérifier si la requête contient le corps (body)
    if (!req.body) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: 'Requête invalide',
        message: 'Le corps de la requête est manquant',
      });
    }

   // Lire le fichier JSON des contacts
    let contacts = [];
    try {
      const rawData = fs.readFileSync('contacts.json', 'utf-8');
      contacts = JSON.parse(rawData);
    } catch (error) {
      console.error('Erreur lors de la lecture du fichier JSON des contacts :', error);
    }

    // Vérifier si l'ID existe déjà dans le fichier JSON
    const { id } = req.body;
    if (contacts.some(contact => contact.id === id)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: 'Requête invalide',
        message: 'Un contact avec cet ID existe déjà',
      });
    }

    // Vérifier si la requête contient les données requises
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


     // Vérifier la longueur du numéro de téléphone
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

    // Si toutes les vérifications passent, passer au middleware suivant
    next();
  }
}