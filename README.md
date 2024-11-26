dentro de la carpeta app/ crear el archivo de configuración

export const CONFIG = {
  db: process.env.DB_CONECTION || '<entorno_base_datos>',
  db_test: process.env.DB_CONECTION || "entorno_base_datos_testing",
  app: {
    platosyplan_port: process.env.PORT || 3000,
  },
  cloudinary:{
    NAME        : process.env.NAME || '<cloudinary_proyect_name>',
    API_KEY     : process.env.API_KEY || '<cloudinary_api_key>',
    API_SECRET  : process.env.API_SECRET || '<cloudinary_api_secret>',
    CLOUDINARY_URL  : process.env.CLOUDINARY_URL || `<cloudinary_url_connect>`,
  }
};
