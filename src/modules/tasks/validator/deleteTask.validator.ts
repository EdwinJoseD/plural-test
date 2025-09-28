import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { handleResponse, HttpCode } from '@/helpers';

export const validateDeleteTaskParams = (params: any) => {
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

export const validateDeleteTaskParamsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { isValid, errors, data } = validateDeleteTaskParams(req.params);
  if (!isValid) {
    return handleResponse(res, HttpCode.BAD_REQUEST, {
      message: 'Error de validación en los parámetros',
      errors,
    });
  }
  req.validatedParams = data;
  next();
};
