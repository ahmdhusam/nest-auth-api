import * as Joi from 'joi';

export const envValidation = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test', 'provision').default('development'),
  PORT: Joi.number().default(3000),
  MONGODB_URI: Joi.string().required(),
  JWT_ACCESS_SECRET: Joi.string().required().min(8),
  JWT_ACCESS_EXPIRES_IN: Joi.string().required().min(2),
  JWT_REFRESH_SECRET: Joi.string().required().min(8),
  JWT_REFRESH_EXPIRES_IN: Joi.string().required().min(2),
}).required();
