import { Router } from "express";
import { 
  createAddress, 
  getAddresses, 
  updateAddress, 
  deleteAddress 
} from "../../controllers/user/address.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/")
  .post(createAddress)
  .get(getAddresses);

router.route("/:id")
  .put(updateAddress)
  .delete(deleteAddress);

export default router;