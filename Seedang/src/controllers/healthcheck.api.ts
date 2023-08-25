import { Application, NextFunction, Request, Response, Router } from "express";
import express from 'express';
import { HealthcheckFlow } from "../flow/healthcheck.flow";
const router = Router();
router.use(express.json())

export const healthCheckRout = (app: Application): void => {
    app.use('/healthcheck', router)
}

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    HealthcheckFlow.findOneById(1)
        .then((healthcheck) => {
            // console.log("userId:"+req["userId"])
            res.json(healthcheck)
        }).catch(next)
})