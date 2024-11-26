import multer, { StorageEngine } from 'multer';
import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

//ESTE MIDDLEWARE EVALUA LA FORMA COMO SE SUBEN LOS ARCHIVOS SI DE FORMA INDIVIDUAL O MULTIPLE
//SE DEBE TENER EN CUENTA QUE EN LA RUTA DONDE SE UTILICE EL PARAMETRO QUE DEBE TENER ES EL DEFINIDO EN LOS TIPOS ('image', 'images')

export type MulterFieldSimpleType   = 'image';      //nombre del campo que recibe la imagen
export type MulterFieldMultipleType = 'images';   //nombre del campo que recibe las multiples imagenes

export class MulterMiddleware {
  private upload: multer.Multer;

  constructor() {
    this.setConfiguration();
  }

  // Configura el almacenamiento de Multer
  private setConfiguration(): void {
    const uploadsDir = path.join(__dirname, '../../uploads'); // Ruta relativa a la carpeta 'uploads'

    // Verificar si la carpeta existe; si no, crearla
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const storage: StorageEngine = multer.diskStorage({
      destination : (_, __, cb) => cb(null, uploadsDir), // Carpeta donde se almacenan los archivos (primer parametro es el req, y el segundo es el file)
      filename: (req, file, cb) => {
        const uniqueFilename = `${Date.now()}-${file.originalname}`;
        console.log("este es file filename storage Engine", file);

        if (file.fieldname ==  "image") {
          req.body.imagePath = path.join(uploadsDir, uniqueFilename);
        }
        
        if (!req.body.imagePaths) {  // Inicializa un array para guardar todas las rutas si no existe
        req.body.imagePaths = [];
        }
      
        if (file.fieldname ==  "images") {
          req.body.imagePaths.push(path.join(uploadsDir, uniqueFilename)); // Agrega la ruta del archivo actual al array
        } 
         
        cb(null, uniqueFilename); // Continúa con el nombre del archivo
      },
    });

    this.upload = multer({ storage });
  }

  // Middleware para manejar subida de un archivo
  public single(fieldName: MulterFieldSimpleType) {
    return (req: Request, res: Response, next: NextFunction) => {
      this.upload.single(fieldName)(req, res, (err: any) => {
        if (err) {
          res.status(400).json({
            message: 'Error al subir archivo',
            error: err.message || 'Error desconocido',
          });
          return; // Asegúrate de finalizar aquí
        }
        return next(); // Añade return explícito aquí
      });
    };
  }

  // Middleware para manejar subida de múltiples archivos
  public multiple(fieldName: MulterFieldMultipleType, maxCount: number) {
    return (req: Request, res: Response, next: NextFunction) => {
      this.upload.array(fieldName, maxCount)(req, res, (err: any) => {
        if (err) {
          res.status(400).json({
            message: 'Error al subir archivos',
            error: err.message || 'Error desconocido',
          });
          console.log("error multer al subir diferentes archivos:", err);
        }
        console.log("esto es lo que le llega al request del multier multiple:", req.body);
        return next(); // Añade return explícito aquí
      });
    };
  }

}
