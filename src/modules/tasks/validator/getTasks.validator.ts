import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { TaskFilter } from '@/models/tasks/tasks.type';
import { handleResponse, HttpCode } from '@/helpers';

const getTasksSchema = Joi.object({
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).default(10),
  fieldName: Joi.string().optional(),
  fieldValue: Joi.string().optional(),
  fieldSort: Joi.string().optional(),
  valueSort: Joi.string().valid('ASC', 'DESC').optional(),
});

export const validateGetTasks = (querys: any) => {
  const { error, value } = getTasksSchema.validate(querys, {
    abortEarly: false,
    convert: true,
  });
  if (error) {
    const formattedErrors = error.details.map(detail => detail.message);
    return {
      isValid: false,
      errors: formattedErrors,
      data: null,
    };
  }
  return {
    isValid: true,
    errors: null,
    data: value as TaskFilter,
  };
};

export const validateGetTasksMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validation = validateGetTasks(req.query);
  if (!validation.isValid) {
    return handleResponse(res, HttpCode.BAD_REQUEST, {
      success: false,
      message: 'Datos de validación incorrectos',
      errors: validation.errors,
    });
  }
  req.validatedQuery = validation.data;
  next();
};
