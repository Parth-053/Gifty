import { Router } from "express";
import { 
  requestReturn, 
  getMyReturns 
} from "../../controllers/user/return.controller.js";
import { verifyAuth } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { createReturnRequestSchema } from "../../validations/return.schema.js";

const router = Router();

router.use(verifyAuth);

router.route("/")
  .get(getMyReturns)
  .post(
    upload.array("images", 3),  
    validate(createReturnRequestSchema), 
    requestReturn
  );

export default router;