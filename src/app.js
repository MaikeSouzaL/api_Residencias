import express from "express";
import routes from "./routes";
class App {
  constructor() {
    this.app = express();
    this.middlewares();
  }
  middlewares() {
    this.app.use(express.json());
  }
  routes() {
    this.app.use(routes);
  }

  routes() {}
}

export default new App().app;