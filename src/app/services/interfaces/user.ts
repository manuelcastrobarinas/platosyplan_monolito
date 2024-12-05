import { Request, Response } from "express";

export interface User {
  name  : string;
  email : string;
  phone : string;
  password : string;
}

export type CustomResponse<TRespose> = void | Response | TRespose;

export interface UserService<TResponse> {
  create(req: Request, res: Response): Promise<CustomResponse<TResponse>>;
  login (req: Request, res: Response): Promise<CustomResponse<TResponse>>;
  getUserCredentials(req: Request, res: Response): Promise<Response<User>>;
}