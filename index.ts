import dotenv from 'dotenv';
import { AuthController } from './features/auth/auth.controller';
import { OxfordController } from './features/oxford/oxford.controller';
import { ProjectController } from './features/project/project.controller';
import { MongoDatabase } from './interfaces/database';
import { AppConstructor, ExpressBase } from './utils/express-base';
import { EnvService } from './services/env.service';

dotenv.config();

const MDW: AppConstructor = [];

const app = new ExpressBase(
  Number(process.env.PORT) || 3000,
  new MongoDatabase(),
  MDW,
  [new AuthController(), new ProjectController(), new OxfordController()],
);
app.listen();
