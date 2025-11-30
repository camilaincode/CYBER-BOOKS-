import express from "express";
import cloudinary from "../lib/cloudinary.js";
import Book from "../model/Book.js";
import protectedRouth from "../middleware/auth.middleware.js"

const router = express.Router();

router.post("/create",protectedRouth ,async (req,res) => {
    try {

        const {title, caption, rating,image} =req.body
        if(!image || !title || !caption || !rating) {return res.status(500).json({message : "Por favor adicione todas as informações!"})}

        const uploadResponse = await cloudinary.uploader.upload(image)
        const imageUrl = uploadResponse.secure_url;

        const newBook = new Book({
            title,
            caption,
            rating,
            image : imageUrl,
            user: req.user._id
        });

        await newBook.save();

        res.status(201).json({message:"livro adicionado com sucesso"});

    } catch (error) {
        console.log("Erro criando livro", error)
        res.status(500).json({message:"falha interna!"})
    }
});

router.get("/read",protectedRouth,(req,res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const skip = (page - 1)*limit;
        const books =  Book.find().sort({createdAt: -1})
        .skip(skip) //pula as paginas já vistas
        .limit(limit)
        .populate("user","username profileImage")

        const total = Book.countDocuments();

        res.send({books, currentPage: page,totalBooks: total, totalPages:Math.ceil(totalBooks/limit)});

    } catch (error) {
        console.log("Error em acessar todos os livros", error)
        res.status(500).json({message:"falha interna!"})
    }
})

export default router;