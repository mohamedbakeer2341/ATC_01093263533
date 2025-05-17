const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Event Booker API",
      version: "1.0.0",
      description: "API documentation for the Event Booker application",
    },
    servers: [
      {
        url: `${process.env.BASE_URL}/api`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

export default swaggerOptions;
