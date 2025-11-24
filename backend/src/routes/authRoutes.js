import express from "express"

const router = express.Router();

router.post("/registrar",async (req,res) => {
    res.send("registrar")
})

router.post("/login",async (req,res) => {
    res.send("login")
})

export default router;