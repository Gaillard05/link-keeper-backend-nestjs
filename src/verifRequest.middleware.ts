import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

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

    // Si toutes les vérifications passent, passer au middleware suivant
    next();
  }
}