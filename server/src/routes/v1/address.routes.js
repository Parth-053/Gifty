import { Router } from "express";
import { 
  createAddress, 
  getAddresses, 
  updateAddress, 
  deleteAddress 
} from "../../controllers/user/address.controller.js";
import { verifyAuth } from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { addressSchema } from "../../validations/user.schema.js";

const router = Router();

router.use(verifyAuth);

router.route("/")
  .post(validate(addressSchema), createAddress)
  .get(getAddresses);

router.route("/:id")
  .put(validate(addressSchema), updateAddress)
  .delete(deleteAddress);

export default router;