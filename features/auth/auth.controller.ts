import * as express from "express";
import { Login, Register, User } from '../../interfaces/auth';
import { HttpResponse } from '../../utils/response';
import { UserModel } from './auth.model';

export class AuthController {
  public path = "/auth";
  public router = express.Router();
  private auth = UserModel;
  private saltRounds: number = 10;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/login`, this.Login);
    this.router.post(`${this.path}/register`, this.Register);
  }

  private Login = async (req: express.Request, res: express.Response) => {
    const { username, password }: Login = req.body;
    const user = await this.auth.findOne({ username });
    if (!user) {
      return HttpResponse.badRequest(res, { message: "User name does not exist" });
    }
    return HttpResponse.success<User>(res, user);
  };

  private Register = async (req: express.Request, res: express.Response) => {
    const { username, password, confirmPassword }: Register = req.body;

    const user = await this.auth.findOne({ username });
    if (user) {
      return HttpResponse.badRequest(res, { message: "Username has been used" });
    }
    if (password !== confirmPassword) {
      return HttpResponse.badRequest(res, { message: "Password not matched" });
    }
    const newUser = new this.auth({
      username,
      password
    });
    await newUser.save();
    return HttpResponse.success(res, { user: newUser });
  };
}