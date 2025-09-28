import { Request, Response, NextFunction } from 'express';
import { handleResponse } from '@/helpers';
import { CreateUserDTO, UserRole } from '@/models/users/users.type';
import Joi from 'joi';

// Esquema de validación para CreateUserDTO
export const createUserSchema = Joi.object({
  // Username: requerido, string, longitud mínima 3, máxima 30
  username: Joi.string()
    .alphanum() // Solo caracteres alfanuméricos
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.base': 'El username debe ser un string',
      'string.empty': 'El username no puede estar vacío',
      'string.alphanum':
        'El username solo puede contener caracteres alfanuméricos',
      'string.min': 'El username debe tener al menos 3 caracteres',
      'string.max': 'El username no puede tener más de 30 caracteres',
      'any.required': 'El username es requerido',
    }),

  // Email: requerido, formato de email válido
  email: Joi.string()
    .email({ tlds: { allow: false } }) // Permitir cualquier TLD
    .lowercase() // Convertir a minúsculas
    .required()
    .messages({
      'string.base': 'El email debe ser un string',
      'string.empty': 'El email no puede estar vacío',
      'string.email': 'Debe ser un email válido',
      'any.required': 'El email es requerido',
    }),

  // Password: requerido, mínimo 8 caracteres, debe contener mayúscula, minúscula y número
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(
      new RegExp(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]'
      )
    )
    .required()
    .messages({
      'string.base': 'La contraseña debe ser un string',
      'string.empty': 'La contraseña no puede estar vacía',
      'string.min': 'La contraseña debe tener al menos 8 caracteres',
      'string.max': 'La contraseña no puede tener más de 128 caracteres',
      'string.pattern.base':
        'La contraseña debe contener al menos: 1 minúscula, 1 mayúscula, 1 número y 1 carácter especial (@$!%*?&)',
      'any.required': 'La contraseña es requerida',
    }),

  // Role: opcional, debe ser uno de los valores del enum
  role: Joi.string()
    .valid(...Object.values(UserRole))
    .optional()
    .messages({
      'string.base': 'El rol debe ser un string',
      'any.only': `El rol debe ser uno de los siguientes: ${Object.values(UserRole).join(', ')}`,
    }),

  // FirstName: opcional, string entre 2 y 50 caracteres
  firstName: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/) // Solo letras y espacios, incluye acentos
    .optional()
    .messages({
      'string.base': 'El nombre debe ser un string',
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede tener más de 50 caracteres',
      'string.pattern.base': 'El nombre solo puede contener letras y espacios',
    }),

  // LastName: opcional, string entre 2 y 50 caracteres
  lastName: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .optional()
    .messages({
      'string.base': 'El apellido debe ser un string',
      'string.min': 'El apellido debe tener al menos 2 caracteres',
      'string.max': 'El apellido no puede tener más de 50 caracteres',
      'string.pattern.base':
        'El apellido solo puede contener letras y espacios',
    }),

  // AvatarUrl: opcional, debe ser una URL válida
  avatarUrl: Joi.string()
    .uri({
      scheme: ['http', 'https'],
    })
    .optional()
    .messages({
      'string.base': 'La URL del avatar debe ser un string',
      'string.uri': 'La URL del avatar debe ser una URL válida (http o https)',
    }),
}).options({
  // Remover campos que no están en el esquema
  stripUnknown: true,
  // Abortar en el primer error encontrado
  abortEarly: false,
});

// Función helper para validar los datos
export const validateCreateUser = (userData: any) => {
  const { error, value } = createUserSchema.validate(userData);

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
    data: value as CreateUserDTO,
  };
};

// Middleware para Express
export const validateCreateUserMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validation = validateCreateUser(req.body);

  if (!validation.isValid) {
    return handleResponse(res, 400, {
      success: false,
      message: 'Datos de validación incorrectos',
      errors: validation.errors,
    });
  }

  // Reemplazar req.body con los datos validados y sanitizados
  req.body = validation.data;
  next();
};
