import { validationResult } from 'express-validator';

export function validateFields(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const mappedErrors = errors.mapped();
    const transformedErrors = Object.keys(mappedErrors).reduce((acc, key) => {
      acc[key] = {
        ...mappedErrors[key],
        error_message: mappedErrors[key].msg, // Renombra msg a error_message
      };
      delete acc[key].msg; // Elimina la clave msg
      return acc;
    }, {});
  
    return res.status(400).json({ ok: false, errors: transformedErrors });
  }
  next();
}