const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Auth System API",
      version: "1.0.0",
      description: "API documentation for Node.js Auth project",
    },
    servers: [
      {
        url: "/",
        description: "Current Server",
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
    paths: {
      "/api/auth/register": {
        post: {
          tags: ["Authentication"],
          summary: "Register a new user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password", "name"],
                  properties: {
                    email: { type: "string", example: "jane@example.com" },
                    password: { type: "string", example: "password123" },
                    name: { type: "string", example: "Jane Doe" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "User registered successfully" },
            400: { description: "User already exists" },
          },
        },
      },
      "/api/auth/login": {
        post: {
          tags: ["Authentication"],
          summary: "User login",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: { type: "string", example: "jane@example.com" },
                    password: { type: "string", example: "password123" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Login successful, returns JWT token" },
            401: { description: "Invalid credentials" },
          },
        },
      },
      "/api/auth/profile": {
        get: {
          tags: ["Profile Management"],
          summary: "Get current user profile",
          description:
            "Returns user data for the currently authenticated user.",
          security: [
            {
              bearerAuth: [],
            },
          ],
          responses: {
            200: {
              description: "User profile data retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: { type: "string", example: "cm5..." },
                      email: { type: "string", example: "jane@example.com" },
                      name: { type: "string", example: "Jane Doe" },
                      createdAt: { type: "string", format: "date-time" },
                    },
                  },
                },
              },
            },
            401: {
              description: "Unauthorized - Missing or invalid token",
            },
            500: {
              description: "Internal server error",
            },
          },
        },
      },
      "/api/auth/change-password": {
        post: {
          tags: ["Profile Management"],
          summary: "Change password (Authorized only)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["oldPassword", "newPassword"],
                  properties: {
                    oldPassword: { type: "string" },
                    newPassword: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Password updated successfully" },
            400: { description: "Old password is incorrect" },
          },
        },
      },
      "/api/auth/forgot-password": {
        post: {
          tags: ["Password Recovery"],
          summary: "Request password reset link",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email"],
                  properties: {
                    email: { type: "string", example: "jane@example.com" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Reset link sent to email" },
            404: { description: "User not found" },
          },
        },
      },
      "/api/auth/reset-password/{token}": {
        post: {
          tags: ["Password Recovery"],
          summary: "Reset password using token",
          parameters: [
            {
              name: "token",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "The reset token from email",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["newPassword"],
                  properties: {
                    newPassword: {
                      type: "string",
                      example: "new-secure-password",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Password updated successfully" },
            400: { description: "Invalid or expired token" },
          },
        },
      },
      "/api/auth/logout": {
        post: {
          tags: ["Authentication"],
          summary: "Logout user",
          responses: {
            200: { description: "Logged out successfully" },
          },
        },
      },
      "/api/auth/health": {
        get: {
          tags: ["System"],
          summary: "Check server status",
          description: "Simple endpoint to verify if the server is running.",
          responses: {
            200: {
              description: "Server is healthy",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "ok" },
                      message: { type: "string", example: "Server is running" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ["./src/server.js", "./src/routes/*.js"],
};

const specs = swaggerJsdoc(options);
module.exports = specs;
