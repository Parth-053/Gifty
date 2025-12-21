import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  getAddresses,
  addAddress,
  deleteAddress,
} from "../controllers/address.controller.js";

const router = express.Router();

router.get("/", protect, getAddresses);
router.post("/", protect, addAddress);
router.delete("/:id", protect, deleteAddress);

export default router;
