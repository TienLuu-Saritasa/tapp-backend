import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import routes from './routes/routes';
import { AppConstructor, ExpressBase } from './utils/express-base';
import { MongoDatabase } from './interfaces/database';
import { AuthController } from './features/auth/auth.controller';

dotenv.config();

// const app: Express = express();
// const port = process.env.PORT;

// app.use(cors());
// app.use(express.json());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// routes.forEach((route) => {
//   app.use("/api", route);
// });


// app.listen(port, () => {
//   console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
// });
const MDW: AppConstructor = [cors(), express.json(), bodyParser.json(), bodyParser.urlencoded({ extended: false })];

const app = new ExpressBase(
  Number(process.env.PORT) || 3000,
  new MongoDatabase(),
  MDW,
  [new AuthController()]
);
app.listen();
