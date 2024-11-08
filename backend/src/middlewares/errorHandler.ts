import { Request, Response, NextFunction } from 'express';
import { ValidationError, DatabaseError, HttpError } from '../utils/errors';
import { AxiosError } from 'axios';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction) => {
    let status: number;
    let message: string;

    if (error instanceof HttpError || error instanceof ValidationError || error instanceof DatabaseError) {
      status = error.status;
      message = error.message;
    } else if (error instanceof AxiosError) {
      status = error.response?.status || 500;
      message = error.response?.data || 'Uknown error occurred';
    } else {
      status = 500;
      message = 'Uknown error occurred';
    }

    res.status(status).json({status, message})
}