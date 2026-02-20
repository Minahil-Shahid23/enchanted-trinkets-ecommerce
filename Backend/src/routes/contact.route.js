import express from "express";
import multer from "multer";
import { handleContactForm, getAllContacts, deleteContact } from "../controllers/contact.controller.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ✅ POST: Handle form submission
router.post("/", upload.single("attachment"), handleContactForm);

// ✅ GET: Fetch all submitted contacts for admin panel
router.get("/all", getAllContacts);
router.delete("/:id", deleteContact); // 👈 Add this line


export default router;
