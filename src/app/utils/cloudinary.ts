import  { v2 as cloudinary, UploadApiResponse }  from 'cloudinary';
import { CONFIG } from '../../config';
import fs from 'fs/promises';

export class CloudinaryService {
  
  constructor() {
    cloudinary.config({
      cloud_name  : CONFIG.cloudinary.NAME,
      api_key     : CONFIG.cloudinary.API_KEY,
      api_secret  : CONFIG.cloudinary.API_SECRET
    });
  }

  public async UploadImage(filePath:string) : Promise<UploadApiResponse> {
    console.log("hola mundo entro");
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'uploads', // Opcional: Especificar carpeta en Cloudinary
      });  
      // Elimina el archivo local después de subirlo
      await fs.unlink(filePath);
      return result;
    } catch (error) {
      console.error('Error subiendo archivo a Cloudinary:', error);
      throw error;
    }
  }
}