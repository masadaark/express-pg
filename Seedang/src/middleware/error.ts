import { CustomError } from "../models/middleware.model";

const createError = ({
    status = 500,
    message = 'Something went wrong',
}: {
    status?: number;
    message?: string;
}): CustomError => {
    const error = new Error(message) as CustomError;
    error.status = status;
    return error;
};

const s = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    CONFLICT: 409,
    NOT_FOUND: 404,
    UNPROCESSABLE: 422,
    GENERIC_ERROR: 500,
};

export { createError, s };