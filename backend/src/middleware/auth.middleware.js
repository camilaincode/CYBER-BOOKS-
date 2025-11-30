import jwt from "jsonwebtoken";
import User from "../model/User.js";

const protectedRouth = async(req,res,next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ","")
        if(!token){return res.status(401).json({message:"token de cadastro não encontrado,acesso negado"})}
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.userId).select("-password");
         if(!user){return res.status(401).json({message:"token invalido!"})}
         req.user = user;
        next();
    } catch (error) {
        console.log("Authtentication erro", error.message)
        res.status(500).json({message:"Token is invalid"})
    }
}

export default protectedRouth;