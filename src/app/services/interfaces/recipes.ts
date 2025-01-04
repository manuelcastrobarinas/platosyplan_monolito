import { Request, Response } from "express";
import { RowRecord } from "./misc/record";

export interface DifficultyRecipeType {
  EASY    : 'FACIL',
  MEDIUM  : 'MEDIA',
  HARD    : 'AVANZADO',
};

export interface IngredientRecipe {
  image? : string,
  name  : string,
  units : number,
};

export interface NutritionalTableElement {
  name    : string,
  amount  : number
};

export interface Nutritional_table_Recipe {
  calories        : NutritionalTableElement, 
  fat             : NutritionalTableElement, 
  satured_fat     : NutritionalTableElement, 
  carbohidrate    : NutritionalTableElement, 
  sugar           : NutritionalTableElement, 
  dietary_fiber   : NutritionalTableElement, 
  protein         : NutritionalTableElement, 
  cholesterol     : NutritionalTableElement, 
  sodium          : NutritionalTableElement, 
};

export interface UtensilsRecipe {
  name  : string,
};

export interface CookingSteps {
  image?      : string,
  description : string,
  utensilios_steps  : UtensilsRecipe[],
  ingredients_steps : IngredientRecipe[],

}

export interface Recipe {
  user_id : string,
  image   : string,
  name    :  string,
  category      : string,
  calification  : number,
  time_create   : number,
  difficulty    : DifficultyRecipeType,   
  description   : string,
  active        : boolean,
  ingredients   : IngredientRecipe[],
  nutricional_table : Nutritional_table_Recipe,
  utensils          : UtensilsRecipe[],
  steps             : CookingSteps[],
};

export type RecipeRecord = RowRecord<Recipe>;
export type CustomResponse<TRespose> = void | Response | TRespose;

export interface RecipeService<TResponse> {
  create(req: Request, res: Response): Promise<CustomResponse<TResponse>>;
  getAllRecipesList(req: Request, res: Response) : Promise<CustomResponse<TResponse>>;
  getMyRecipes(req:Request, res: Response)  : Promise<CustomResponse<Response<Recipe[]>>>;
  ChangeActiveRecipe(req:Request, res:Response)  : Promise<CustomResponse<TResponse>>;
}