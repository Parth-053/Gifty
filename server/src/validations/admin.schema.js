import Joi from "joi";

export const updateStatusSchema = Joi.object({
  status: Joi.string().valid("approved", "rejected", "pending", "suspended").required(),
  reason: Joi.string().when('status', {
    is: 'rejected',
    then: Joi.required(),
    otherwise: Joi.optional()
  })
});