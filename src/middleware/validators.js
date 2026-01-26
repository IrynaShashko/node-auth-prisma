const { z } = require("zod");

const registerSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  name: z.string().min(2, "Name is too short").optional(),
});

const loginSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body); 
  if (!result.success) {
    return res.status(400).json({
      error: "Validation failed",

      details: result.error.format(),
    });
  }

  req.body = result.data;
  next();
};

module.exports = { registerSchema, loginSchema, validate };
