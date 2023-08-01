// src/auth.middleware.ts

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly credentials: any;

  constructor() {
    const data = fs.readFileSync('credentials.json');
    this.credentials = JSON.parse(data.toString());
  }

  use(req: Request, res: Response, next: NextFunction) {
    const clientId = req.headers['client-id'] as string;
    const token = req.headers.authorization;

    if (!clientId || !token) {
      return res.status(401).json({ message: 'Unauthorized. Missing headers.' });
    }

    const clientCredential = this.credentials.clientCredential.find(
      (credential) => credential.clientId === clientId
    );

    if (!clientCredential || clientCredential.code1 !== token.split(' ')[1]) {
      return res.status(401).json({ message: 'Unauthorized. Invalid credentials.' });
    }

    next();
  }
}
