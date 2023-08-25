import { Application, Request, Response } from 'express';
import { ErrorMiddleware } from '../models/middleware.model';
import { s } from './error';

const unauthorized: ErrorMiddleware = (err, _req, res, next) => {
    if (err.status !== s.UNAUTHORIZED) return next(err);
    res.status(s.UNAUTHORIZED).json({
        ok: false,
        errorMessage: String(err.message) || 'Unauthorized',
    });
};

const forbidden: ErrorMiddleware = (err, _req, res, next) => {
    if (err.status !== s.FORBIDDEN) return next(err);
    res.status(s.FORBIDDEN).json({
        ok: false,
        errorMessage: String(err.message) || 'Forbidden',
    });
};

const conflict: ErrorMiddleware = (err, _req, res, next) => {
    if (err.status !== s.CONFLICT) return next(err);
    res.status(s.CONFLICT).json({
        ok: false,
        errorMessage: String(err.message) || 'Conflict',
    });
};

const badRequest: ErrorMiddleware = (err, _req, res, next) => {
    if (err.status !== s.BAD_REQUEST) return next(err);
    res.status(s.BAD_REQUEST).json({
        ok: false,
        errorMessage: String(err.message) || 'Bad Request',
    });
};

const unprocessable: ErrorMiddleware = (err, _req, res, next) => {
    if (err.status !== s.UNPROCESSABLE) return next(err);
    res.status(s.UNPROCESSABLE).json({
        ok: false,
        errorMessage: String(err.message) || 'Unprocessable entity',
    });
};

const notFound: ErrorMiddleware = (err, _req, res, next) => {
    if (err.status !== s.NOT_FOUND) return next(err);
    res.status(s.NOT_FOUND).json({
        ok: false,
        errorMessage: String(err.message) || 'The requested resource could not be found',
    });
};

const genericError: ErrorMiddleware = (err, _req, res, next) => {
    if (err.status !== s.GENERIC_ERROR) return next(err);
    res.status(s.GENERIC_ERROR).json({
        ok: false,
        errorMessage: String(err.message) || 'Internal server error',
    });
};

const catchall = (_req: Request, res: Response) => {
    res.status(s.NOT_FOUND).json({
        ok: false,
        errorMessage: 'The requested resource could not be found',
    });
};

const middlewareConfig = {
    unauthorized,
    forbidden,
    conflict,
    badRequest,
    unprocessable,
    notFound,
    genericError,
    catchall,
};

const setUpMiddleWare = (app: Application): void => {
    for (const middleware of Object.values(middlewareConfig)) {
        app.use(middleware);
    }
};

export { setUpMiddleWare };