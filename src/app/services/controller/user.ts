import { Request, Response } from "express";
import { UserModel } from '../../models/user';
import { CustomResponse, User, UserService } from '../interfaces/user';
import { generateToken } from '../../helpers/jwt';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
 
export type UserRespose = CustomResponse<User>;

export class UserController implements UserService<UserRespose> {
  
  public async create(req: Request, res: Response) : Promise<UserRespose> {
    let { email, password } : { email:string, password:string } = req.body;
     
    try {
      const find_email : User|null = await UserModel.findOne({email});;
      if (find_email) return res.status(400).json({ok: false, error_message: 'este correo ya esta registrado'});
      
      const salt = bcrypt.genSaltSync(10);
      password = bcrypt.hashSync(password, salt);

      const user:User = {
        name  : req.body.name,
        email : email,
        phone : req.body.phone,
        password
      };

      const user_model  = await UserModel.create({id: crypto.randomUUID(), ...user});
      const token = await generateToken(user_model.id); // generacion de jwt    
      
      return res.status(200).json({ok: true, message: 'crear usuario!!', user: user_model, token});
    } catch (error) {
      console.error("error creando el usuario", error);
      return res.status(400).json({ok: false, error_message: `error al crear el usuario: ${error}`});
    }
  }


  public async login(req: Request, res: Response): Promise<any> {
    const { email, password } = req.body;
    try {
      const find_user = await UserModel.findOne({email});
      if (!find_user) return res.status(400).json({ok: false, error_message: 'email no encontrado'});
      
      const validPassword = bcrypt.compareSync(password, find_user.password);
      if (!validPassword) return res.status(400).json({ok: false, error_message: 'la contraseña no es valida'});
  
      const token = await generateToken(find_user.id);
      return res.status(200).json({ ok: true, message: 'usuario logeado', user: find_user, token});
    } catch (error) {
      console.error('error en el login', error);
      return res.status(400).json({ok: false, error_message: `error al intentar logearse ${error}`});
    }
  }
  
  public async getUserCredentials(req: Request, res: Response): Promise<Response<User>> {
    try {  
      const userId = req.headers.id as string;
      if (!userId) return res.status(400).json({ ok: false, error_message: 'No se encontró el ID del usuario en la petición' });

      const user = await UserModel.findOne({id: userId});
      if (!user) return res.status(404).json({ ok: false, error_message: 'Usuario no encontrado' });

      const token = await generateToken(userId);
      return res.status(200).json({ ok: true, message: 'se han obtenido las credenciales del usuario con exito', user: user, token: token });
    } catch (error) {
      console.error('Error al obtener las credenciales del usuario:', error);
      return res.status(400).json({ ok: false, error_message: `Error al obtener las credenciales del usuario ${error}` });
    }
  }
}