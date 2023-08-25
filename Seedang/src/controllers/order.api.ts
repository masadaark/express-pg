import { Application, Router } from "express";
import express from 'express';
const router = Router();
router.use(express.json())

export const healthCheckRout = (app: Application): void => {
    app.use('/order', router)
}