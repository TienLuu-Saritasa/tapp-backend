import cors from 'cors';
import express, { Application } from 'express';
import { Server } from 'http';
import { Database } from '../interfaces/database';

export interface AppConstructor {
  forEach: (arg0: (controller: any) => void) => void;
}

export class ExpressBase {
  public readonly app: Application;

  constructor(
    protected readonly port: number,
    databaseConfigs: Database,
    middleWares: AppConstructor,
    controllers: AppConstructor,
  ) {
    this.app = express();

    this.middleware(middleWares);
    this.connectDatabase(databaseConfigs);
    this.routes(controllers);
  }

  private routes(controllers: AppConstructor): void {
    controllers.forEach((controller) => {
      this.app.use('/api', controller.router);
    });
  }

  private middleware(middleWares: AppConstructor): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));

    middleWares.forEach((middleWare) => {
      this.app.use(middleWare);
    });
  }

  private connectDatabase(database: Database): void {
    database.connect();
  }

  public listen(): Server {
    const server = this.app.listen(this.port, () => {
      console.log({
        type: 'Success',
        message: `Server is listening on http://localhost:${this.port}`,
      });
    });
    return server;
  }
}
