import swaggerJsdoc from "swagger-jsdoc";

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
            201: {
              description: "Registration successful! Verification email sent.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "success" },
                      data: {
                        type: "object",
                        properties: {
                          user: {
                            type: "object",
                            properties: {
                              id: { type: "integer", example: 1 },
                              name: { type: "string", example: "Jane Doe" },
                              email: {
                                type: "string",
                                example: "jane@example.com",
                              },
                              isVerified: { type: "boolean", example: false },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: "User already exists or invalid data",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        example: "User already exist with this email",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/auth/verify-email/{token}": {
        get: {
          tags: ["Authentication"],
          summary: "Verify user email",
          parameters: [
            {
              name: "token",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "The verification token sent to user's email",
            },
          ],
          responses: {
            200: { description: "Email verified successfully" },
            400: { description: "Invalid or expired token" },
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
            403: {
              description: "Email not verified",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        example: "Please verify your email first.",
                      },
                    },
                  },
                },
              },
            },
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
      "/api/reviews": {
        post: {
          tags: ["Reviews"],
          summary: "Create a new review (Authorized only)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["rating", "comment", "userId"],
                  properties: {
                    rating: {
                      type: "integer",
                      minimum: 1,
                      maximum: 5,
                      example: 5,
                    },
                    comment: {
                      type: "string",
                      example: "Great service, highly recommend!",
                    },
                    userId: {
                      type: "string",
                      example: "cm5abc123xyz",
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Review created successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: {
                        type: "string",
                        example: "success",
                      },
                      data: {
                        type: "object",
                        properties: {
                          review: {
                            type: "object",
                            properties: {
                              id: {
                                type: "string",
                                example: "cm5review123",
                              },
                              rating: {
                                type: "integer",
                                example: 5,
                              },
                              comment: {
                                type: "string",
                                example: "Great service",
                              },
                              userId: {
                                type: "string",
                                example: "cm5abc123xyz",
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
            400: {
              description: "Invalid request data",
            },
            401: {
              description: "Unauthorized",
            },
            500: {
              description: "Internal server error",
            },
          },
        },

        get: {
          tags: ["Reviews"],
          summary: "Get all reviews",
          responses: {
            200: {
              description: "List of all reviews",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: {
                        type: "string",
                        example: "success",
                      },
                      results: {
                        type: "integer",
                        example: 2,
                      },
                      data: {
                        type: "object",
                        properties: {
                          reviews: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                id: {
                                  type: "string",
                                  example: "cm5review123",
                                },
                                rating: {
                                  type: "integer",
                                  example: 5,
                                },
                                comment: {
                                  type: "string",
                                  example: "Amazing experience!",
                                },
                                createdAt: {
                                  type: "string",
                                  format: "date-time",
                                },
                                user: {
                                  type: "object",
                                  properties: {
                                    name: {
                                      type: "string",
                                      example: "Jane Doe",
                                    },
                                    email: {
                                      type: "string",
                                      example: "jane@example.com",
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
                },
              },
            },
            500: {
              description: "Internal server error",
            },
          },
        },
      },
      "/api/book-service": {
        post: {
          tags: ["Book Service"],
          summary: "Book a service (Authorized only)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "email", "phone", "service", "comment"],
                  properties: {
                    name: { type: "string", example: "Kate" },
                    email: { type: "string", example: "kate@example.com" },
                    phone: { type: "string", example: "+380123456789" },
                    service: { type: "string", example: "Послуга 1" },
                    comment: {
                      type: "string",
                      example: "Коментар до бронювання",
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Service booked successfully" },
            400: { description: "Invalid request data" },
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
          tags: ["Profile Management"],
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
          tags: ["Profile Management"],
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
export default specs;
