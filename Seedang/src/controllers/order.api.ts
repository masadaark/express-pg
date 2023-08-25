import { Application, Router } from "express";
import express from 'express';
const router = Router();
router.use(express.json())

export const orderRout = (app: Application): void => {
    app.use('/order', router)
}

router.get('/', (_req: Request, res: Response, next: NextFunction) => {
    
})