import Joi from "joi";

const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

export const createProductSchema = Joi.object({
  name: Joi.string().required().trim().max(150),
  description: Joi.string().required(),
  price: Joi.number().required().min(0),
  discountPrice: Joi.number().min(0).less(Joi.ref('price')),
  stock: Joi.number().integer().min(0).default(0),
  categoryIds: Joi.alternatives().try(
    Joi.array().items(Joi.string().custom(objectId)),
    Joi.string().custom(objectId) // Handle single ID sent as string
  ),
  tags: Joi.string().optional(), // Expecting comma separated string "gift, toy"
  isCustomizable: Joi.boolean().default(false),
  visibility: Joi.string().valid('public', 'hidden')
});

export const updateProductSchema = Joi.object({
  name: Joi.string().trim().max(150),
  description: Joi.string(),
  price: Joi.number().min(0),
  discountPrice: Joi.number().min(0).less(Joi.ref('price')),
  stock: Joi.number().integer().min(0),
  categoryIds: Joi.alternatives().try(
    Joi.array().items(Joi.string().custom(objectId)),
    Joi.string().custom(objectId)
  ),
  tags: Joi.string(),
  isCustomizable: Joi.boolean(),
  visibility: Joi.string().valid('public', 'hidden')
}).min(1); // At least one field required to update

export const getProductsSchema = Joi.object({
  search: Joi.string().allow(""),
  category: Joi.string(),
  minPrice: Joi.number().min(0),
  maxPrice: Joi.number().min(0),
  rating: Joi.number().min(0).max(5),
  sortBy: Joi.string().valid('price', 'createdAt', 'ratingAvg'),
  sortOrder: Joi.string().valid('asc', 'desc'),
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100)
});