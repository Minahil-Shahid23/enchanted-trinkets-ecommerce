import multer from "multer";
import path from "path";

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // ✅ Vercel par local folder nahi banta, isliye '/tmp' use karna lazmi hai
    // Local environment mein ye './public/temp' use karega
    const uploadPath = process.env.NODE_ENV === 'production' ? '/tmp' : './public/temp';
    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${file.fieldname}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage }).array("files", 10);