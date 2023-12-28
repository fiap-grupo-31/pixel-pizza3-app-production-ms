import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  failOnErrors: true,
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0'
    }
  },
  // Coloque o caminho para seus comentários JSDoc aqui
  apis: [`./**/*.${process.env.production ? 'js' : 'ts'}`, 'interfaces/**/*.js']
};

console.log(options)

export const swaggerSpec = swaggerJSDoc(options);
