import { Application } from "express"
import { healthCheckRout } from "./healthcheck.api";
import { userRout } from "./user.api";

export const setUpRouter = (app: Application): void => {
    healthCheckRout(app)
    userRout(app)
}