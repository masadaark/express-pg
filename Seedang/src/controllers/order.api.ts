import { Application, Router, NextFunction, Request, Response } from "express";
import express from 'express';
import { createError, s } from '../middleware/error';
import { jwtVerify } from "../intercepter/jwt.interceptor";
import { OrderFlow } from "../flow/order.flow";
import { CreateOrderModel } from "../models/order.model";
import { CreateInsurance } from "../models/insurance.model";
import { PaymentFlow } from "../flow/payment.flow";
import { PolicyFlow } from "../flow/policy.flow";
import dayjs from "dayjs";
import { OrderCreateLogic } from "../logic/order.create.logic";
const router = Router();
router.use(express.json())

export const orderRout = (app: Application): void => {
    app.use('/order', jwtVerify, router)
}

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request: CreateOrderModel = req.body;
        const userId: number = req['userId'];
        await OrderFlow.CreateOrder(request, userId)
            .catch(err => next(err))
            .then(raw => {
                res.json(raw)
            })
    }catch (error) {
        console.error(error);
        next(createError({
            status: s.BAD_REQUEST,
            message: "An error occurred while processing the request"
        }));
    }
})
router.post('/insurance', async (req: Request, res: Response, next: NextFunction) => {
    const request: CreateInsurance = req.body;
    const userId: number = req['userId'];
    try {
        await OrderCreateLogic.validUserId(userId, request.orderId)
    } catch (err) {
        return next(err)
    }
    try {
        res.json(await OrderFlow.CreateInsurance(request, userId))
    } catch (err) {
        return next(err)
    }
})

router.post('/payment', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await OrderCreateLogic.validUserId(req['userId'], req.body.orderId)
    } catch (err) {
        return next(err)
    }
    try {
        await PaymentFlow.payment(req.body, req['userId'])
        try {
            return res.json(await PolicyFlow.apply(req.body.orderId, req['userId']))
        } catch (err) {
            return next(err)
        }
    } catch (err) {
        return next(err)
    }
})
router.get('/status', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await OrderFlow.GetOrderState(req['userId'])
            .then(raw => {
                if (!raw.length || raw.every(member => dayjs(member.startDate).startOf('date').isBefore(dayjs().startOf('date')))) {
                    return res.json([])
                }
                return res.json(raw)
            })

    } catch (err) {
        return next(err)
    }
})