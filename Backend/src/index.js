import express from "express";
import dotenv from "dotenv";
import uploadRoutes from "./routes/upload.route.js";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./db/connectDB.js";
import cors from "cors";
import orderRoutes from "./routes/order.routes.js";
import productRoutes from "./routes/product.routes.js";
import contactRoutes from "./routes/contact.route.js";
import weeklyProductRoutes from "./routes/weeklyProduct.route.js";

dotenv.config();
connectDB(); 

const app = express();
const PORT = process.env.PORT || 8000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/public", express.static(path.join(__dirname, "public")));

app.use(cors());
app.use(express.json());

// ✅ All Routes
app.use("/api", uploadRoutes);
app.use("/api/products", productRoutes);
app.use("/api", orderRoutes);
app.use("/api/contact", contactRoutes); 
app.use("/api/weekly-products", weeklyProductRoutes);

// ✅ Yeh hissa Vercel aur Local dono ko handle karega
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`✅ Server is running on port ${PORT}`);
    });
}

export default app;