import { Request, Response } from "express";
import {  CookingSteps, CustomResponse, Recipe, RecipeService } from '../interfaces/recipes';
import { RecipeModel } from '../../models/recipes';
import { CloudinaryService } from "../../utils/cloudinary";
import crypto from 'crypto';

export type RecipeTId = string;
export type RecipeRespose = CustomResponse<Recipe>;

export class RecipeController implements RecipeService<RecipeRespose> {
  
  constructor() {}

  public async create(req: Request, res: Response): Promise<RecipeRespose> {

    try {
    const imagespath: string[] = req.body.imagePaths;
    if (!imagespath || imagespath.length == 0) return res.status(400).json({ ok: false,  error_message: 'No se encontraron las imagenes en la solicitud.'});
    if (!req.body.steps || !Array.isArray(req.body.steps) || req.body.steps.length === 0) return res.status(400).json({ ok: false, error_message: "Los pasos de la receta son requeridos."});
    
    const  user_id: string  = req.headers.id!.toString();
  
      let imageLinks: string[] = [];
      const cloudinaryService: CloudinaryService = new CloudinaryService();
      
      //guardamos y obtenemos el url de las imagenes
      for (const image of imagespath) {
        const {secure_url} = await cloudinaryService.UploadImage(image);
        imageLinks.push(secure_url);
      } 
      
      let final_steps:CookingSteps[] = [];
      let principal_image: string;
    
      imageLinks.forEach((imageLink:string, index:number) => {
        if (index === 0) {
          principal_image = imageLink; // La primera imagen será la principal
        } else {
          const stepData = req.body.steps[index - 1];
          if (stepData) {
            final_steps.push({
              image: imageLink,
              description: stepData.description,
              utensilios_steps: stepData.utensilios_steps,
              ingredients_steps: stepData.ingredients_steps,
            });
          }
        }
      });

      const recipe: Recipe = {
        user_id : user_id,
        image   : principal_image!,
        name    : req.body.name,
        category : req.body.category,
        calification  : req.body.calification,
        time_create   : req.body.time_create,
        difficulty    : req.body.difficulty,
        description   : req.body.description,
        ingredients   : req.body.ingredients,
        nutricional_table : req.body.nutricional_table,
        utensils          : req.body.utensils,
        steps         : final_steps,
        active        : true
      }

      const  recipe_model_database:Recipe = await RecipeModel.create({
        id: crypto.randomUUID(),
        ...recipe,
        CreatedAt: new Date(),
        UpdatedAt: new Date()
      });

      return res.status(200).json({ok:true, message:'El reporte se ha creado con exito', data: recipe_model_database});
    } catch (error) {
      console.error(error);
      return res.status(400).json({ok:false, error_message:'error creando el reporte'});
    }  
  }
    
  async getAllRecipesList(req: Request, res: Response): Promise<CustomResponse<RecipeRespose>> {
    const { difficulty, create_region, max_time,  page = 1, limit = 10 } = req.query;
    try {
      const filters:any = { active: true };
      if (difficulty)     filters.difficulty    = difficulty;
      if (create_region)  filters.create_region = create_region;
      if (max_time)       filters.max_time      = { $lte: Number(max_time) }; // Filtrar por tiempo máximo

      // Cálculo para la paginación
      const page_number:number = Math.max(1, Number(page));     // Asegura que la página sea al menos 1
      const page_size:number   = Math.max(1, Number(limit));    // Asegura que el límite sea al menos 1
      const skip:number        = (page_number - 1) * page_size; // Cálculo del índice inicial de la consulta

      // Consulta a la base de datos con filtros y paginación
      const [all_recipes, total_count] : [ Recipe[], number ] = await Promise.all([
        RecipeModel.find(filters).skip(skip).limit(page_size),  // Obtener recetas con paginación
        RecipeModel.countDocuments(filters),                    // Contar el total de recetas con los filtros
      ]);  
    
      const total_pages:number = Math.ceil(total_count / page_size);

      return res.status(200).send({
        ok: true, 
        message: 'todas las recetas',  
        data: { 
          recipes: all_recipes, 
          pagination: {
            total_count,
            total_pages: total_pages,
            current_page: page_number,
            page_size: page_size,
          },
        },
      }); 
    } catch (error) {
      console.error('error obteniendo todas las recetas', error);
      return res.status(400).send({ok:false, error_message: `error obteniendo las recetas: ${error}`}); 
    }
  }

  async ChangeActiveRecipe(req: Request, res: Response): Promise<Response<RecipeRespose>> {
    try {      
      const { recipe_id, active } = req.body;
      const search_recipe = await RecipeModel.findOneAndUpdate({id: recipe_id}, {active: active},  {new: true, runValidators: true});
      if (!search_recipe) return res.status(400).json({ok: false, error_message: 'la receta seleccionada no existe'});
      return res.status(200).json({ok: true, message: 'estado de la receta actualizado con exito'});
    } catch (error) {
      return res.status(400).json({ok: false, error_message: `error actualizando el estado de la receta: ${error}`}); 
    }
  }
  
  public async getMyRecipes(req: Request, res: Response): Promise<CustomResponse<Response<Recipe[]>>> {
    try {
      const user_id  = req.headers.id;
      const my_recipes: Recipe[] = await RecipeModel.find({user_id: user_id});
      if (!my_recipes) return res.status(400).json({ok: true, error_message: 'no tienes recetas creadas', data: { recipes: []}});
      return res.status(200).json({ok: true, message: 'recetas encontradas', data: { recipes: my_recipes }});
    } catch (error) {
      return res.status(400).json({ok:false, error_message: `error al obtener mis recetas ${error}`});      
    }
  }
}