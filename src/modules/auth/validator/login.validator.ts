import { NextFunction, Request, Response } from 'express';
import { handleResponse } from '@/helpers';
import Joi from 'joi';
import { LoginDTO } from '@/models/users/users.type';

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const validateLoginSchema = (loginData: any) => {
  const { error, value } = loginSchema.validate(loginData);
  if (error) {
    // Formatear errores de manera amigable
    const formattedErrors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
      value: detail.context?.value,
    }));

    return {
      isValid: false,
      errors: formattedErrors,
      data: null,
    };
  }

  return {
    isValid: true,
    errors: null,
    data: value as LoginDTO,
  };
};

export const validateLoginMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validation = validateLoginSchema(req.body);

  if (!validation.isValid) {
    return handleResponse(res, 400, {
      success: false,
      message: 'Datos de validación incorrectos',
      errors: validation.errors,
    });
  }

  next();
};
