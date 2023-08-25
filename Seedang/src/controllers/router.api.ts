import { Application } from "express"
import { healthCheckRout } from "./healthcheck.api";

export const setUpRouter = (app: Application): void => {
    healthCheckRout(app)
}