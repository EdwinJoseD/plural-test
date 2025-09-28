import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import {
  CreateTaskDTO,
  TaskPriority,
  TaskStatus,
} from '@/models/tasks/tasks.type';
import { handleResponse, HttpCode } from '@/helpers';

const createTaskSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    'string.base': 'El título debe ser un string',
    'string.empty': 'El título no puede estar vacío',
  }),
  description: Joi.string().max(500).optional().messages({
    'string.base': 'La descripción debe ser un string',
  }),
  status: Joi.string()
    .valid(...Object.values(TaskStatus))
    .default(TaskStatus.PENDING)
    .messages({
      'any.only': `El estado debe ser uno de los siguientes valores: ${Object.values(
        TaskStatus
      ).join(', ')}`,
    }),
  priority: Joi.string()
    .valid(...Object.values(TaskPriority))
    .default(TaskPriority.MEDIUM)
    .messages({
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

export const validateCreateTask = (taskData: any) => {
  const { error, value } = createTaskSchema.validate(taskData, {
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
    data: value as CreateTaskDTO,
  };
};

export const validateCreateTaskMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { isValid, errors, data } = validateCreateTask(req.body);
  if (!isValid) {
    return handleResponse(res, HttpCode.BAD_REQUEST, {
      message: 'Error de validación',
      errors,
    });
  }
  req.body = data;
  next();
};
