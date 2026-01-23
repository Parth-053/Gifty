import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().min(3).max(200).required(),
  description: Joi.string().min(10).required(),
  shortDescription: Joi.string().max(300).allow(""),
  
  price: Joi.number().min(0).required(),
  discountPrice: Joi.number().min(0).less(Joi.ref('price')).messages({
    "number.less": "Discount price must be less than regular price"
  }),
  
  categoryId: Joi.string().hex().length(24).required(),
  stock: Joi.number().integer().min(0).required(),
  
  isCustomizable: Joi.boolean(),
  customizationOptions: Joi.array().items(Joi.string()),  
  
  tags: Joi.array().items(Joi.string())
});

export const updateProductSchema = Joi.object({
  name: Joi.string().min(3).max(200),
  description: Joi.string().min(10),
  shortDescription: Joi.string().max(300),
  price: Joi.number().min(0),
  discountPrice: Joi.number().min(0).less(Joi.ref('price')),
  stock: Joi.number().integer().min(0),
  isCustomizable: Joi.boolean(),
  customizationOptions: Joi.array().items(Joi.string()),
  tags: Joi.array().items(Joi.string()),
  isActive: Joi.boolean()
}).min(1);