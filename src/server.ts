import express, { Application } from "express"
import { setUpDB } from "./config/db.config"
import { setUpRouter } from "./controllers/router.api"
import { setUpConfig } from "./config/env.config"

const app: Application = express()

setUpConfig()

setUpDB()

setUpRouter(app)

app.listen(8080, () => console.log("Server is running..."))