import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  failOnErrors: true,
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          name: 'bearerAuth',
          in: 'header',
          bearerFormat: 'JWT',
          scheme: 'bearer'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    schemes: [
      'https',
      'http'
    ]
  },
  // Coloque o caminho para seus comentários JSDoc aqui
  apis: [`./**/*.${process.env.production ? 'js' : 'ts'}`, 'interfaces/**/*.js']
};

console.log(options)

export const swaggerSpec = swaggerJSDoc(options);
