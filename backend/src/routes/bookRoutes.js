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
});

router.get("/user", protectedRouth,(req,res)=>{
    try {
        const books = Book.find({user:req.user._id}).sort({createdAt: -1});
        res.json(books)
    } catch (error) {
        console.error("Error em acessar livros", error)
        res.status(500).json({message:"falha interna!"}) 
    }
});

router.delete("/delete/:id",protectedRouth,(req,res)=>{
    try {
        const book = Book.findById(req.params.id);
        if(!book){
           return res.status(404).json({message:"esse livro não existe!"})
        }
        if(book.user.toString() !== req.user._id.toString()){
            return res.status(401).json({message:"não permitido!"})
        }

        if(book.image && book.image.includes("cloudinary")){
            try {
                const publicId = book.image.split("/").pop().split(".")[0];
                cloudinary.uploader.destroy(publicId)
            } catch (deleteError) {
                console.log("Error em deletar imagem do cloudinary ", deleteError)
            }
        }

        book.deleteOne();
        res.json({message:"livro deletado com sucesso!"})

    } catch (error) {
       console.log("Error em deletar livro", error)
        res.status(500).json({message:"falha interna!"}) 
    }
});
export default router;