import { Application, NextFunction, Request, Response, Router } from "express";
import express from 'express';
import { User } from '../models/user.model';
import { createError, s } from '../middleware/error';
import { UserFlow } from "../flow/user.flow";
import { mapUserToUserTable } from "../logic/user.logic";
const router = Router();
router.use(express.json())

export const userRout = (app: Application): void => {
    app.use('/user', router)
}

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    const request: User = req.body;
    try {
        const emailExists = await UserFlow.checkUser(request.email)
        if (emailExists) return res.json({ id: emailExists })
        res.json({ id: await UserFlow.Insert(mapUserToUserTable(request)) })
    } catch (err) {
        console.error(err);
        next(createError({
            status: s.BAD_REQUEST,
            message: "An error occurred while processing the request"
        }));
    }
});