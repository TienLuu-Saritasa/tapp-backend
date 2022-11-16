import dotenv from 'dotenv';
import { AuthController } from './features/auth/auth.controller';
import { ProjectController } from './features/project/project.controller';
import { MongoDatabase } from './interfaces/database';
import { AppConstructor, ExpressBase } from './utils/express-base';

dotenv.config();

const MDW: AppConstructor = [];

const app = new ExpressBase(
  Number(process.env.PORT) || 3000,
  new MongoDatabase(),
  MDW,
  [new AuthController(), new ProjectController()]
);
app.listen();
