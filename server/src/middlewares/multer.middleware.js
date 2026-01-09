import multer from "multer";

/**
 * Multer Configuration
 * Stores files temporarily on the server's disk (./public/temp)
 * before we upload them to Cloudinary.
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp"); // Make sure this folder exists!
  },
  filename: function (req, file, cb) {
    // Keep original name but prepend timestamp to avoid conflicts
    // e.g. "17094234_profile.jpg"
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
  }
});

// File Filter (Optional: Reject non-image files)
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/webp") {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file format. Only JPG, PNG, and WEBP allowed."), false);
  }
};

export const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limit file size to 5MB
  },
  fileFilter
});