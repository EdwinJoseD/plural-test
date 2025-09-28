import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import {
  TaskPriority,
  TaskStatus,
  UpdateTaskDTO,
} from '@/models/tasks/tasks.type';
import { handleResponse, HttpCode } from '@/helpers';

const updateTaskSchema = Joi.object({
  title: Joi.string().min(3).max(100).optional().messages({
    'string.base': 'El título debe ser un string',
    'string.min': 'El título debe tener al menos 3 caracteres',
    'string.max': 'El título no debe exceder los 100 caracteres',
  }),
  description: Joi.string().max(500).optional().messages({
    'string.base': 'La descripción debe ser un string',
  }),
  status: Joi.string()
    .valid(...Object.values(TaskStatus))
    .optional()
    .messages({
      'string.base': 'El estado debe ser un string',
      'any.only': `El estado debe ser uno de los siguientes valores: ${Object.values(
        TaskStatus
      ).join(', ')}`,
    }),
  priority: Joi.string()
    .valid(...Object.values(TaskPriority))
    .optional()
    .messages({
      'string.base': 'La prioridad debe ser un string',
      'any.only': `La prioridad debe ser uno de los siguientes valores: ${Object.values(
        TaskPriority
      ).join(', ')}`,
    }),
  projectId: Joi.string().uuid().optional().messages({
    'string.guid': 'El projectId debe ser un UUID válido',
  }),
  assignedTo: Joi.string().uuid().optional().messages({
    'string.guid': 'El assignedTo debe ser un UUID válido',
  }),
  createdBy: Joi.string().uuid().optional().messages({
    'string.guid': 'El createdBy debe ser un UUID válido',
  }),
  dueDate: Joi.date().greater('now').optional().messages({
    'date.base': 'La fecha de vencimiento debe ser una fecha válida',
    'date.greater': 'La fecha de vencimiento debe ser una fecha futura',
  }),
  estimatedHours: Joi.number().min(0).optional().messages({
    'number.base': 'Las horas estimadas deben ser un número',
    'number.min': 'Las horas estimadas no pueden ser negativas',
  }),
  actualHours: Joi.number().min(0).optional().messages({
    'number.base': 'Las horas reales deben ser un número',
    'number.min': 'Las horas reales no pueden ser negativas',
  }),
});

export const validateUpdateTask = (taskData: any) => {
  const { error, value } = updateTaskSchema.validate(taskData, {
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
    data: value as UpdateTaskDTO,
  };
};

export const validateUpdateTaskMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { isValid, errors, data } = validateUpdateTask(req.body);
  if (!isValid) {
    return handleResponse(res, HttpCode.BAD_REQUEST, {
      message: 'Error de validación',
      errors,
    });
  }
  req.body = data;
  next();
};

export const validateUpdateTaskParams = (params: any) => {
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

export const validateUpdateTaskParamsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { isValid, errors, data } = validateUpdateTaskParams(req.params);
  if (!isValid) {
    return handleResponse(res, HttpCode.BAD_REQUEST, {
      message: 'Error de validación en los parámetros',
      errors,
    });
  }
  req.validatedParams = data;
  next();
};
