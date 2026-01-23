import Joi from "joi";

export const toggleWishlistSchema = Joi.object({
  productId: Joi.string().hex().length(24).required()
});