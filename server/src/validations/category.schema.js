import Joi from "joi";

export const createCategorySchema = Joi.object({
  name: Joi.string().min(2).max(100).trim().required(),
  description: Joi.string().max(500).allow(""),
  parentId: Joi.string().hex().length(24).allow(null, "") 
});

export const updateCategorySchema = Joi.object({
  name: Joi.string().min(2).max(100).trim(),
  description: Joi.string().max(500).allow(""),
  parentId: Joi.string().hex().length(24).allow(null, ""),
  isActive: Joi.boolean()
}).min(1);
