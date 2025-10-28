const Joi = require('joi');

function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    next();
  };
}

const registerSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('customer', 'vendor', 'admin').optional(),
  phone: Joi.string().optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const requestOtpSchema = Joi.object({
  identifier: Joi.string().required()
});

const verifyOtpSchema = Joi.object({
  identifier: Joi.string().required(),
  code: Joi.string().length(6).required()
});

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  requestOtpSchema,
  verifyOtpSchema
};
