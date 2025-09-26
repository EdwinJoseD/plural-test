
import { IsString, IsBase64, IsEnum } from 'class-validator';
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { readFileSync } from 'fs';
import { join } from 'path';
var detect = require('detect-file-type');

interface DocumentType {
    mimeType: string;
    size: number;
    type: string;
}

function getDocumentTypes(): DocumentType[] {
    const filePath = join('src', 'datajson/documentType.json'); // Ajustar la ruta según sea necesario
    const fileContent = readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent) as DocumentType[];
}

export enum MimeType {
    PDF = "application/pdf",
    DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    JPG = "image/jpeg",
    PNG = "image/png",
    TXT = "text/plain"
}


export enum FileType {
    PDF = "pdf",
    DOCX = "docx",
    XLSX = "xlsx",
    JPG = "jpg",
    PNG = "png",
    TXT = "txt"
}


export class DocumentRequest {
    @IsString()
    transactionId: string;

    @IsString()
    filename: string

    @IsString()
    @IsBase64()
    @IsFileAndMaxSize2MB({
        message: 'El archivo no debe superar los 2 MB'
    })
    fileBase64: string;

    @IsString()
    @IsEnum(MimeType, {
        message: () => `contentType debe ser uno de los siguientes valores: ${Object.values(MimeType).join(', ')}`
    })
    contentType: MimeType;

    @IsString()
    typeFile: string
}

export function IsFileAndMaxSize2MB(property: { message: string }, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'IsFileAndMaxSize2MB',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const buffer = Buffer.from(value, 'base64');
                    const documentTypes = getDocumentTypes();
                    const objectInstance = args.object as DocumentRequest;

                    let detectedMimeTypeFile;
                    detect.fromBuffer(buffer, (err, result) => {
                        if (err) {
                            log.info('Error detectando el tipo de archivo:', err);
                            return;
                        }
                        detectedMimeTypeFile = result
                        log.info('Tipo de archivo detectado:', result);
                        return result;
                        // result tendrá propiedades como ext para la extensión y mime para el tipo MIME
                    });

                    const matchedDocumentType = documentTypes.find(dt => dt.type === objectInstance.typeFile.toUpperCase());

                    const typeList = matchedDocumentType.mimeType.split(',');

                    const format = typeList.find(f => f === detectedMimeTypeFile.mime);

                    if (!(format === detectedMimeTypeFile.mime)) {
                        this.defaultMessage = () => `InvalidFileTypeError`;
                        return false;
                    }

                    const maxSizeInBytes = matchedDocumentType.size * 1024;
                    const isSizeValid = buffer.length <= maxSizeInBytes;

                    if (!isSizeValid) {
                        this.defaultMessage = () => 'FileSizeExceededError';
                        return false;
                    }
                    return true;
                },
                defaultMessage: () => property.message
            }
        });
    };
}
