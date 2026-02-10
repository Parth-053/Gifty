import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().required().min(3).max(100),
  description: Joi.string().required().min(10),
  price: Joi.number().required().min(0),
  discountPrice: Joi.number().min(0).allow(null, ""),
  categoryId: Joi.string().required(), // Expecting ObjectId string
  stock: Joi.number().integer().min(0).default(0),
  isCustomizable: Joi.boolean().default(false),
  
  // Arrays might come as single strings from FormData, basic validation here
  tags: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()),
  customizationOptions: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()),
  
  // Allow images field but don't enforce it here, Controller checks req.files
  images: Joi.any() 
});

export const updateProductSchema = Joi.object({
  name: Joi.string().min(3).max(100),
  description: Joi.string().min(10),
  price: Joi.number().min(0),
  discountPrice: Joi.number().min(0).allow(null, ""),
  categoryId: Joi.string(),
  stock: Joi.number().integer().min(0),
  isCustomizable: Joi.boolean(),
  isActive: Joi.boolean(),
  tags: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()),
  customizationOptions: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()),
  images: Joi.any()
});