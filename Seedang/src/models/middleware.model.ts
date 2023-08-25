import { NextFunction, Request, Response } from "express";

export interface CustomError extends Error {
    status: number;
    message: string
}

export type ErrorMiddleware = (
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) => void;