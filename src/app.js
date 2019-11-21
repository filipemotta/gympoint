import express from "express";
import routes from "./routes";

import Database from "./database";

class App {
  constructor() {
    this.express = express();

    this.database();
    this.middlewares();
    this.routes();
  }

  database() {
    Database;
  }

  middlewares() {
    this.express.use(express.json());
  }
  routes() {
    this.express.use(routes);
  }
}

export default new App().express;
//module.exports = new App().express;
