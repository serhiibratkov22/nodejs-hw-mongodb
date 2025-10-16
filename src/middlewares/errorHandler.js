// src/middlewares/errorHandler.js
import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    const responseData =
      err.status === 400
        ? { message: err.message, errors: err.errors || [] }
        : { message: err.message };

    res.status(err.status).json({
      status: err.status,
      message: err.name,
      data: responseData,
    });
    return;
  }

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: { message: err.message },
  });
};
