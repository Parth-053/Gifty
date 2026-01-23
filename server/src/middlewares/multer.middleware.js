import multer from "multer";
import { ApiError } from "../utils/ApiError.js";
import { FILE_UPLOAD } from "../constants/system.js";

// Use Memory Storage (Buffer) for Cloudinary Uploads
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (FILE_UPLOAD.ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, "Invalid file type. Only JPG, PNG, and WebP are allowed."), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: FILE_UPLOAD.MAX_FILE_SIZE, 
    files: FILE_UPLOAD.MAX_FILES_COUNT 
  }
});