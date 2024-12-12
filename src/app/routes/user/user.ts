import { Router } from 'express';
import { RoutesApp } from '../../core/routes';
import { UserController } from '../../services/controller/user';
import { validateFields } from '../../middleware/validate-fields';
import { check } from 'express-validator';
import { validateJwt } from '../../middleware/validate-jwt';

export class AuthRouter extends RoutesApp {
  public router: Router;
  private userController: UserController;

  constructor() {
    super();
    this.router = Router();
    this.userController = new UserController();
    this.setServiceRoutes();
  }

  protected setServiceRoutes(): void {
    this.router.post('/create', [
        check('name', 'el nombre es obligatorio').not().isEmpty(),
        check('password', 'la contraseña es obligatoria').not().isEmpty(),
        check('phone', 'el correo es obligatorio').not().isEmpty(),
        check('email', 'el correo es obligatorio').isEmail(),
        validateFields
      ],
      this.userController.create
    ),
    this.router.post('/', [
        check('email', 'el nombre es obligatorio').isEmail(),
        check('password', 'la contraseña es obligatoria').not().isEmpty(),
        validateFields
      ],
      this.userController.login
    ),
    this.router.get('/me', validateJwt, this.userController.getUserCredentials),
    this.router.patch('/update', validateJwt, this.userController.update)
  }
}