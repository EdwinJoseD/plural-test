import { Request, Response, NextFunction } from 'express';
import { DocumentRequest, FileType } from '@/helpers';
import { ValidationError, validate } from 'class-validator';
import { HttpCode, handleResponse } from '../../helpers';

export const processFile: any = async (req: Request | any, res: Response, next: NextFunction) => {
    const documentRequest = new DocumentRequest();
    Object.assign(documentRequest, req.body);
    
    const errors: ValidationError[] = await validate(documentRequest);

    if (errors.length > 0) {
        // Suponiendo que solo nos importa el primer error encontrado
        const firstError = errors[0];
        const errorMessages = {
            UnsupportedFileTypeError: "Tipo de archivo no soportado.",
            InvalidFileTypeError: {
                menssage: `Tipo de archivo no permitido.`,
                typeFile: documentRequest.typeFile
            },
            FileSizeExceededError: {
                menssage: `El archivo excede el tamaño máximo permitido de 2 MB.`,
                typeFile: documentRequest.typeFile
            }
        };

        // Encuentra el primer mensaje de error en las restricciones del ValidationError
        if (firstError && firstError.constraints) {
            const errorCode = Object.values(firstError.constraints)[0];
            const errorMessage = errorCode ? errorMessages[errorCode as keyof typeof errorMessages] : "Error desconocido en la validación del archivo.";
            handleResponse(res, HttpCode.BAD_REQUEST, { error: errorMessage });
        } else {
            handleResponse(res, HttpCode.BAD_REQUEST, { error: "Error desconocido en la validación del archivo." });
        }
    } else {
        req.body.file = documentRequest.fileBase64;
        req.body.nameFile = documentRequest.filename +"_"+ documentRequest.typeFile;
        next();
    }
};
