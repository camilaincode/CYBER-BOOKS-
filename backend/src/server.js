import express from "express";
import "dotenv/config";
import authRoutes from "./routes/authRoutes.js";

const app = express()
const PORT = process.env.PORT || 3000;

app.use("/cyber/book",authRoutes)

app.listen(PORT, () => {
    console.log(`essa aplicação esta rodando em port:${PORT}` )
})