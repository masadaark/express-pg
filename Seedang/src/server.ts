import express, { Application } from "express";
import { setUpRouter } from "./controllers/router.api";
import { appConfig, setUpConfig } from "./config/env.config";
import { setUpDB } from "./db";
import { setUpMiddleWare } from "./middleware/middleware";

async function startServer() {
  try {
    const app: Application = express();
    setUpConfig();
    await setUpDB();
    setUpRouter(app);
    setUpMiddleWare(app)
    const serverPort = appConfig().connection.serverport;
    app.listen(serverPort, () => {
      console.log(`Server is running port :${serverPort}`);
    });
  } catch (error) {
    console.error("An error occurred while starting the server:", error);
  }
}

startServer();