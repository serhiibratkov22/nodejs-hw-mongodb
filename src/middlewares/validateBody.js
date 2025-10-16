// src/middlewares/validateBody.js
import createHttpError from 'http-errors';

export const validateBody = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, {
      abortEarly: false,
    });
    next();
  } catch (err) {
    const formattedErrors =
      err.details?.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      })) || [];

    const error = createHttpError(400, 'Bad Request', {
      errors: formattedErrors,
    });
    next(error);
  }
};
