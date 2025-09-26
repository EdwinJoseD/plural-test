import expressJSDocSwagger, { Options } from 'express-jsdoc-swagger';
import { Application } from 'express';
const {PREFIX} = process.env

const options: Options = {
	info: {
		title: 'API Saturation Pickup',
		version: '1.0.0',
		description: 'api rest SP',
	},
	//security: {
	//	BearerAuth: {
	//		type: 'http',
	//		scheme: 'bearer',
	//	},
	//},
	baseDir: __dirname,
	filesPattern: [
		"../../../src/**/*.js",
		"../../../src/**/*.ts",
		"../../../dist/src/**/*.js"
	],
	swaggerUIPath: PREFIX+'/api-docs',
	exposeSwaggerUI: true,
	exposeApiDocs: true,
	apiDocsPath: PREFIX+'/v3/api-docs',
	notRequiredAsNullable: false,
};

export const SwaggerSpec = async (app: Application) => {
	expressJSDocSwagger(app)(options);
};
