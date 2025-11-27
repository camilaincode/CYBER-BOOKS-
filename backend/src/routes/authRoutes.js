import express from "express"
import  User  from "../model/User.js"
import jwt from "jsonwebtoken";

const router = express.Router();

const generateToken = (userId) => {
    return jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:"15d"})
}

router.post("/registrar", async (req, res) => {
    try {
        const { email, username, password } = req.body;

        if (!email || !username || !password) {
            return res.status(400).json({ message: "todos os campos devem ser preenchidos" })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "a senha deve ter mais de 5 digitos" })
        }

        if (username.length < 3) {
            return res.status(400).json({ message: "o nome de usuario deve ter mais de 2 digitos" })
        }

       const existingEmail = await User.findOne({email});

       if(existingEmail){
        return res.status(400).json({ message: "esse email já está sendo utilizado" })
       }

       const existingUsername = await User.findOne({username});

       if(existingEmail){
        return res.status(400).json({ message: "esse username já está sendo utilizado" })
       }

       const profileImage = `https://api.dicebear.com/9.x/identicon/svg?seed=${username}`

       const user = new User({
        username,email,password,profileImage})

        await user.save();

        const token = generateToken(user._id)

        res.status(201).json({
            token,
            user:{
                _id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage
            }
        })

    } catch (error) {
        console.log("Error em registrar usuario!", error)
        res.status(500).json({message:"erro interno!"})
    }
})

router.post("/login", async (req, res) => {
    try {
        const {email,password} = req.body;
        if(!email || !password) { return res.status(500).json({message : "preencha todos os campos para efeturar o login"}) }

        const user = await User.findOne({email})

        if(!user){return res.status(500).json({message : "esse usuario não existe"})}

        const isPasswordCorrect = await user.comparePassword(password);

        if(!isPasswordCorrect){return res.status(500).json({message : "credenciais invalidas"})}

        const token = generateToken(user._id)

        res.status(201).json({
            token,
            user:{
                _id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage
            }
        })
    } catch (error) {
        console.log("Error em logar usuario!", error)
        res.status(500).json({message:"erro interno!"})
    }
})

export default router;