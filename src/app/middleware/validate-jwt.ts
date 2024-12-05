import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { CONFIG } from '../../config';

export function validateJwt(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ ok: false, error_message: 'No hay un token en la petición'});
    if (!authHeader.startsWith('Bearer ')) return res.status(400).json({ok: false, error_message: 'Token con formato incorrecto'})
  
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, CONFIG.jwt_key);
    if (typeof decoded === 'object' && 'id' in decoded) {
      req.headers.id = (decoded as JwtPayload).id as string;
      next();
      return;
    }

    return res.status(401).json({ ok: false, error_message: 'Token no válido o no contiene id' });
  } catch (error) {
    console.error('Error en la validación del token:', error);
    if (error instanceof jwt.TokenExpiredError) return res.status(401).json({ ok: false, error_message: 'El token ha expirado' });
    return res.status(401).json({ ok: false, error_message: `Token no válido: ${error}` });
  }
}
