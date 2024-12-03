import { Express } from "express";
import { RecipeRouter } from "./recipes/recipes";
import { AuthRouter } from './user/user';

export class RoutesApi {
  private _app : Express; //Api principal 
  private recipeRouter : RecipeRouter; //rutas de las recetas
  private authRouter  : AuthRouter;

  constructor(api: Express) {
    this._app = api;
    this.recipeRouter = new RecipeRouter();
    this.authRouter   = new AuthRouter();
    this.initRoutes();
  }

  //iniciar las rutas para cada caso
  private initRoutes(): void {
    this._app.use('/api/v1/recipes', this.recipeRouter.router);
    this._app.use('/api/v1/user', this.authRouter.router);
  }
}