import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { CreateTaskCommentDTO } from '@/models/taskComments/taskComments.type';
import { handleResponse, HttpCode } from '@/helpers';

const createTaskCommentSchema = Joi.object({
  taskId: Joi.string().uuid().required().messages({
    'string.guid': 'El taskId debe ser un UUID válido',
    'any.required': 'El taskId es un campo obligatorio',
  }),
  userId: Joi.string().uuid().required().messages({
    'string.guid': 'El userId debe ser un UUID válido',
    'any.required': 'El userId es un campo obligatorio',
  }),
  content: Joi.string().min(3).max(500).required().messages({
    'string.base': 'El contenido debe ser un string',
    'string.empty': 'El contenido no puede estar vacío',
    'string.min': 'El contenido debe tener al menos 3 caracteres',
    'string.max': 'El contenido debe tener como máximo 500 caracteres',
    'any.required': 'El contenido es un campo obligatorio',
  }),
});

export const validateCreateTaskComment = (taskData: any) => {
  const { error, value } = createTaskCommentSchema.validate(taskData, {
    abortEarly: false,
    convert: true,
    allowUnknown: true,
  });
  if (error) {
    const errorMessages = error.details.map(detail => detail.message);
    return {
      isValid: false,
      errors: errorMessages,
      data: null,
    };
  }
  return {
    isValid: true,
    errors: null,
    data: value as CreateTaskCommentDTO,
  };
};

export const validateCreateTaskCommentsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { isValid, errors, data } = validateCreateTaskComment(req.body);
  if (!isValid) {
    return handleResponse(res, HttpCode.BAD_REQUEST, {
      message: 'Error de validación',
      errors,
    });
  }
  req.body = data;
  next();
};

export const validateAddTaskCommentParams = (params: any) => {
  const schema = Joi.object({
    id: Joi.string().uuid().required().messages({
      'string.base': 'El id debe ser un string',
      'string.guid': 'El id debe ser un UUID válido',
      'any.required': 'El id es obligatorio',
    }),
  });

  const { error, value } = schema.validate(params, {
    abortEarly: false,
    convert: true,
    allowUnknown: true,
  });

  if (error) {
    const errorMessages = error.details.map(detail => detail.message);
    return {
      isValid: false,
      errors: errorMessages,
      data: null,
    };
  }

  return {
    isValid: true,
    errors: null,
    data: value as { id: string },
  };
};

export const validateAddTaskCommentParamsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { isValid, errors, data } = validateAddTaskCommentParams(req.params);
  if (!isValid) {
    return handleResponse(res, HttpCode.BAD_REQUEST, {
      message: 'Error de validación',
      errors,
    });
  }
  req.validatedParams = data;
  next();
};
