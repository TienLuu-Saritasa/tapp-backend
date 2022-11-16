import { Request, Response, Router } from 'express';
import bcrypt from 'bcrypt';
import { Login, Register, User } from '../../interfaces/auth';
import { HttpResponse } from '../../utils/response';
import { UserModel } from './auth.model';

export class AuthController {
  public readonly path = '/auth';
  public readonly router = Router();
  private readonly userModel = UserModel;
  private readonly saltRounds = 10;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(`${this.path}/login`, this.login);
    this.router.post(`${this.path}/register`, this.register);
  }

  private login = async (req: Request, res: Response): Promise<Response> => {
    const { username, password }: Login = req.body;
    const user = await this.userModel.findOne({ username });
    if (!user) {
      return HttpResponse.badRequest(res, { message: 'User name does not exist' });
    }
    const isPasswordCorrect = await bcrypt.compare(password.toString(), user.password.toString());
    if (!isPasswordCorrect) {
      return HttpResponse.badRequest(res, { message: 'Wrong password' });
    }
    return HttpResponse.success<User>(res, user);
  };

  private register = async (req: Request, res: Response): Promise<Response> => {
    const { username, password, confirmPassword }: Register = req.body;

    const user = await this.userModel.findOne({ username });
    if (user) {
      return HttpResponse.badRequest(res, { message: 'Username has been used' });
    }
    if (password !== confirmPassword) {
      return HttpResponse.badRequest(res, { message: 'Password not matched' });
    }
    const hashPassword = await bcrypt.hash(password, this.saltRounds);
    const newUser = new this.userModel({
      username,
      password: hashPassword,
    });
    await newUser.save();
    return HttpResponse.success(res, { user: newUser });
  };
}
