import { Application, Router, NextFunction, Request, Response } from "express";
import express from 'express';
import { createError, s } from '../middleware/error';
import { InsuranceOrder } from "../models/insurance.model";
import { jwtVerify } from "../intercepter/jwt.interceptor";
import { CraeteOrderFlow } from "../flow/order.create.flow";
const router = Router();
router.use(express.json())

export const orderRout = (app: Application): void => {
    app.use('/order', router)
}

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try{
        const request : InsuranceOrder = req.body;
        const userId : number = Number(req.query.id);
        new CraeteOrderFlow().process(request, userId)
            .then(raw => {
                res.json(raw)
            })
    }
    catch(error){
        console.error(error);
        next(createError({
            status: s.BAD_REQUEST,
            message: "An error occurred while processing the request"
        }));
    }
})
