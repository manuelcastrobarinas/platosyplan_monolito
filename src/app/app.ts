import express, { Express } from "express";
import { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { CONFIG } from "../config";
import { ServerApp } from "./core/server";
import { RoutesApi } from "./routes/routes";
import { dbConnection } from "./database/mongo/connect";

export class Server implements ServerApp {
  app: Express;
  server: any;

  constructor() {
    this.app = express();
    this.setServerComunnication();
    new RoutesApi(this.app);
  }

  protected setServerComunnication(): void {
    this.app.use(bodyParser.json());
    this.app.use(cors());
  }

  async start() {
    this.app.use(async (_, __, next) => {
      try {
        console.log('pues aqui llaando otro router desde el next');
        await next(null);
      } catch (err) {
        console.log("The error ocurred in the main app");
        next(err)
      };
    })

    //prub root
    this.app.get("/", (_req: Request, res: Response) => {
      res.send("Platos y plan");
    });

    //listen
    this.server = this.app.listen(process.env.PORT || 3000, () => {
      console.log('server started');
    });
  }

  async close(): Promise<void> {
    if (this.server) {
      await this.server.close();
    }
  }

}

const server = new Server();

try {
  (async () => {
    if (require.main == module) {
      await server.start();
      dbConnection();
      console.log(`
        -> API listen on ${CONFIG.app.gogoBackendPort}
        -> Bot Server started 
      `);
    }
  })();
} catch (error) {
  console.log("Error levantando el servidor", { error });
}