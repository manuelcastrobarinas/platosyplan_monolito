import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { CONFIG } from '../../config';

export function validateJwt(req: Request, res: Response, next: NextFunction) {
  const token = req.header('x-token');
  try {
    if (!token) return res.status(401).json({ ok: false, error_message: 'No hay un token en la petición' });
    const decoded = jwt.verify(token, CONFIG.jwt_key);

    // Verifica si decoded es un objeto y contiene 'uid'
    if (typeof decoded === 'object' && 'uid' in decoded) {
      req.headers.uid = (decoded as JwtPayload).uid as string;
      next();
      return; // Detenemos la ejecución para evitar enviar dos respuestas
    }

    return res.status(401).json({ ok: false, error_message: 'Token no válido o no contiene uid' });
  } catch (error) {
    console.error('Token no válido:', error);
    return res.status(401).json({ ok: false, error_message: 'Token no válido' });
  }
}
