import express, { type Application } from 'express';
import cors, { type CorsOptions } from 'cors';
import { requireRequestId } from '../middlewares/base';

class Routes {
  constructor(app: Application) {}
}

export default class Server {
  constructor(app: Application) {
    this.config(app);
    new Routes(app);
  }

  private config(app: Application): void {
    const corsOptions: CorsOptions = {
      credentials: true,
    };

    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Methods', 'GET POST OPTIONS');
      res.header('Access-Control-Expose-Headers', 'X-New-Token');
      next();
    });
    app.use(cors(corsOptions));
    app.use(requireRequestId);
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
  }
}
