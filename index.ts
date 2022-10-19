import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import routes from './routes/routes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

routes.forEach((route) => {
  app.use("/api", route);
});


app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
