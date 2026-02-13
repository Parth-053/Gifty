import { Router } from "express";
import { 
  addAddress, 
  getAddresses, 
  updateAddress, 
  deleteAddress,
  setDefaultAddress 
} from "../../controllers/user/address.controller.js";
import { verifyAuth } from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { addressSchema } from "../../validations/user.schema.js";

const router = Router();

// Protect all address routes
router.use(verifyAuth);

router.route("/")
  .get(getAddresses)
  .post(validate(addressSchema), addAddress);

router.route("/:id")
  .put(validate(addressSchema), updateAddress)
  .delete(deleteAddress);

// Specific route to toggle default status
router.route("/:id/default")
  .patch(setDefaultAddress);

export default router;