import jwt, { JwtPayload }  from 'jsonwebtoken';
import { CONFIG } from '../../config';

interface CustomJwtPayload extends JwtPayload {
  id: string;
}

export async function generateToken(id) : Promise<any> {
  try {
    const payload = { id };
    const token =  jwt.sign(payload, CONFIG.jwt_key, {expiresIn: '48h'});
    return token;
  } catch (error) {
    console.error('no se pudo gererar el jwt', error); 
  }
}

export function checkToken(token: string): [boolean, string | Error] {
  try {
    const decoded = jwt.verify(token, CONFIG.jwt_key) as CustomJwtPayload;
    if (decoded && decoded.id) {
      return [true, decoded.id];
    }

    return [false, new Error('Token does not contain id')];
  } catch (error) {
    return [false, error as Error];
  }
}