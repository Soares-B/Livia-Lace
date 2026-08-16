import "dotenv/config";
import express from "express";
import db from "./database.js";
import cors from "cors";

import clientRoutes from "./client.js";
import productsRoutes from "./products.js";
import cartRoutes from "./cart.js";
import paymentRoutes from "./payment.js";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    "http://localhost:5000",
    "https://livia-lace.vercel.app"
  ]
}));
app.use(express.json());
app.use(express.static('../frontend'));

app.use('/api', clientRoutes);
app.use('/api', productsRoutes);
app.use('/api', cartRoutes);
app.use('/api', paymentRoutes);

app.get("/", (req, res) => {
    res.sendFile("index.html", { root: "../frontend" });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "online",
    message: "Servidor funcionando",
    timestamp: new Date()
  });
});

app.listen(PORT, () => {
    console.log(`Server initialized in port: ${PORT}`);
});

const result = await db.query("SELECT NOW()");

console.log(result.rows);