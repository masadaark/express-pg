import { Application, NextFunction, Request, Response, Router } from "express";
import express from 'express';
const router = Router();
router.use(express.json())

export const healthCheckRout = (app: Application): void => {
    app.use('/user', router)
}

router.post('/', (_req: Request, res: Response, next: NextFunction) => {

})