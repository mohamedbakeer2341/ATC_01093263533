import Joi from "joi";

export const eventCreateValidation = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Event name is required",
    "any.required": "Event name is required",
  }),
  description: Joi.string().required().messages({
    "string.empty": "Description is required",
    "any.required": "Description is required",
  }),
  date: Joi.date().iso().greater("now").required().messages({
    "date.base": "Date must be a valid ISO format (YYYY-MM-DDTHH:MM:SSZ)",
    "date.greater": "Event date must be in the future",
    "any.required": "Date is required",
  }),
  venue: Joi.string().required().messages({
    "string.empty": "Venue is required",
    "any.required": "Venue is required",
  }),
  price: Joi.number().min(0).required().messages({
    "number.base": "Price must be a number",
    "number.min": "Price cannot be negative",
    "any.required": "Price is required",
  }),
  capacity: Joi.number().min(1).optional().messages({
    "number.base": "Capacity must be a number",
    "number.min": "Capacity must be at least 1",
  }),
  category: Joi.string()
    .valid("concert", "conference", "workshop", "exhibition", "sports")
    .required()
    .messages({
      "any.only": "Invalid event category",
      "any.required": "Category is required",
    }),
});

export const eventUpdateValidation = Joi.object({
  name: Joi.string().optional().messages({
    "string.empty": "Event name cannot be empty",
  }),
  description: Joi.string().optional().messages({
    "string.empty": "Description cannot be empty",
  }),
  date: Joi.date().iso().greater("now").optional().messages({
    "date.base": "Date must be a valid ISO format (YYYY-MM-DDTHH:MM:SSZ)",
    "date.greater": "Event date must be in the future",
  }),
  venue: Joi.string().optional().messages({
    "string.empty": "Venue cannot be empty",
  }),
  price: Joi.number().min(0).optional().messages({
    "number.base": "Price must be a number",
    "number.min": "Price cannot be negative",
  }),
  capacity: Joi.number().min(1).optional().messages({
    "number.base": "Capacity must be a number",
    "number.min": "Capacity must be at least 1",
  }),
  category: Joi.string()
    .valid("concert", "conference", "workshop", "exhibition", "sports")
    .optional()
    .messages({
      "any.only": "Invalid event category",
    }),
}).min(1);
