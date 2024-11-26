import { Request, Response } from "express";
import { RowRecord } from "./misc/record";

export interface DifficultyRecipeType {
  EASY    : 'FACIL',
  MEDIUM  : 'MEDIA',
  HARD    : 'AVANZADO',
};

export interface IngredientRecipe {
  image : string,
  name  : string,
  units : number,
};

export interface NutricionalTableElement {
  name    : string,
  amount  : number
};

export interface Nutricional_table_Recipe {
  calories        : NutricionalTableElement, 
  fat             : NutricionalTableElement, 
  satured_fat     : NutricionalTableElement, 
  carbohidrate    : NutricionalTableElement, 
  sugar           : NutricionalTableElement, 
  dietary_fiber   : NutricionalTableElement, 
  protein         : NutricionalTableElement, 
  cholesterol     : NutricionalTableElement, 
  sodium          : NutricionalTableElement, 
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
  image : string,
  name  : string,
  create_region : string,
  calification  : number,
  time_create   : number,
  difficulty    : DifficultyRecipeType,   
  description   : string,
  ingredients   : IngredientRecipe[],
  nutricional_table : Nutricional_table_Recipe,
  utensils          : UtensilsRecipe[],
  steps             : CookingSteps[],
};

export type RecipeRecord<TId> = RowRecord<TId, Recipe>;
export type CustomResponse<TRespose> = void | Response | TRespose;

export interface RecipeService<TResponse> {
  create(req: Request, res: Response): Promise<CustomResponse<TResponse>>;
  getAllRecipesList(req: Request, res: Response) : Promise<CustomResponse<TResponse>>;
}