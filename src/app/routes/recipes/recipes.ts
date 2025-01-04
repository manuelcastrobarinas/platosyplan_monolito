import { Router } from 'express';
import { RecipeController } from '../../services/controller/recipes';
import { RoutesApp } from '../../core/routes';
import { MulterMiddleware } from '../../middleware/multer';
import { validateJwt } from '../../middleware/validate-jwt';

export class RecipeRouter extends RoutesApp {
  public router: Router;
  private recipeController: RecipeController;
  private multerMiddleware: MulterMiddleware;
  
  constructor() {
    super();
    this.router = Router();
    this.recipeController = new RecipeController();
    this.multerMiddleware = new MulterMiddleware();
    this.setServiceRoutes();
  }
  
  protected setServiceRoutes(): void {
    this.router.post('/create', validateJwt, this.multerMiddleware.multiple('images', 10),(req, res) => this.recipeController.create(req, res)); // Controlador que maneja la lógica posterior
    // this.router.post('/create', this.multerMiddleware.single('image'),(req, res) => this.recipeController.create(req, res)); // Controlador que maneja la lógica posterior
    this.router.get('/all', this.recipeController.getAllRecipesList);
    this.router.get('/myrecipes', validateJwt ,this.recipeController.getMyRecipes);
    this.router.patch('/active', validateJwt, this.recipeController.ChangeActiveRecipe);
  }
}
