import Joi from "joi";
import { GENDERS, AGE_RANGES, FEATURE_NAMES } from "../constants/enums.js";

export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
  age: Joi.number().integer().min(1).max(120).required(),
  gender: Joi.string()
    .valid(...GENDERS)
    .required(),
});

export const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export const trackSchema = Joi.object({
  feature_name: Joi.string()
    .valid(...FEATURE_NAMES)
    .required(),
});

export const analyticsSchema = Joi.object({
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().min(Joi.ref("startDate")).optional(),
  age: Joi.string()
    .valid(...AGE_RANGES)
    .optional(),
  gender: Joi.string()
    .valid(...GENDERS)
    .optional(),
  feature: Joi.string()
    .valid(...FEATURE_NAMES)
    .optional(),
});
