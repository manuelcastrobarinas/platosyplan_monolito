import { Express } from "express";
import { RecipeRouter } from "./recipes/recipes";

export class RoutesApi {
  private _app : Express; //Api principal 
  private recipeRouter : RecipeRouter; //rutas de las recetas

  constructor(api: Express) {
    this._app = api;
    this.recipeRouter = new RecipeRouter();
    this.initRoutes();
  }

  //iniciar las rutas para cada caso
  private initRoutes(): void {
    this._app.use('/api/v1/recipes', this.recipeRouter.router);
  }
}