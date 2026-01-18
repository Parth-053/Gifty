import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().min(3).max(200).trim().required(),
  description: Joi.string().min(10).required(),
  shortDescription: Joi.string().max(300).allow(""),
  
  price: Joi.number().min(0).required(),
  discountPrice: Joi.number().min(0).less(Joi.ref('price')).messages({
    "number.less": "Discount price must be less than original price"
  }),
  
  categoryId: Joi.string().hex().length(24).required(), // MongoDB ObjectId check
  stock: Joi.number().integer().min(0).required(),
  
  isCustomizable: Joi.boolean(),
  customizationOptions: Joi.array().items(Joi.string()),
  
  tags: Joi.array().items(Joi.string()),
  
  attributes: Joi.array().items(
    Joi.object({
      key: Joi.string().required(),
      value: Joi.string().required()
    })
  )
});

export const updateProductSchema = Joi.object({
  name: Joi.string().min(3).max(200).trim(),
  description: Joi.string().min(10),
  price: Joi.number().min(0),
  discountPrice: Joi.number().min(0),
  stock: Joi.number().integer().min(0),
  isActive: Joi.boolean(),
  isCustomizable: Joi.boolean()
}).min(1); // At least one field must be present to update