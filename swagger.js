const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const outputFile = './swagger-output.json';
const routes = ['./routes/hospitals.js']; // Update this to include all your route files

const doc = {
  info: {
    title: 'Library API',
    version: '1.0.0',
    description: 'A simple Express VacQ API'
  },
  servers: [
    {
      url: 'http://localhost:5000/api/v1'
    }
  ],
  tags: [
    {
      name: 'Hospital',
      description: 'Endpoints related to hospitals'
    }
  ],
  paths: {} // Clear default paths
};

// Generate Swagger documentation
swaggerAutogen(outputFile, routes, doc).then(() => {
  console.log('Swagger documentation generated');
});
