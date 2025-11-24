import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`database conectada com sucesso! ${conn.connection.host}`)
    } catch (error) {
        console.log(`erro em conectar com o database `,error)
        process.exit(1)
    }
}