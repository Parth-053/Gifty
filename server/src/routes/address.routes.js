import { Router } from "express";
import { 
  addAddress, 
  getAddresses, 
  getAddressById, 
  updateAddress, 
  deleteAddress 
} from "../controllers/user/address.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/")
  .get(getAddresses)
  .post(addAddress);

router.route("/:addressId")
  .get(getAddressById)
  .patch(updateAddress)
  .delete(deleteAddress);

export default router;