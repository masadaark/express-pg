import express, { Application } from "express"
import { setUpDB } from "./config/db.config"
import { setUpRouter } from "./controllers/router.api"
import { setUpConfig } from "./config/env.config"

const app: Application = express()
const port: number = Number(process.env.DOCKER_PORT) || 3000;

setUpConfig()

setUpDB()

setUpRouter(app)

app.listen(port, () => console.log("Server is running..."))