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

    // Si toutes les vérifications passent, passer au middleware suivant
    next();
  }
}