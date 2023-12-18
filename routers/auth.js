const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateIdenticon = require("../utils/generateIdenticon");

const prisma = new PrismaClient();

router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);

    const defaultProfileImage = generateIdenticon(username);

    const user = await prisma.user.create({
        data: {
            username: username,
            email:email,
            password: hashPassword,
            profile: {
                create:{
                    bio: "はじめまして",
                    profileImage: defaultProfileImage,
                },
            },
        },
        include: { profile: true },
    });
    
    return res.json({ user });
});

//ユーザログインAPI
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email }});

    if (!user) {
        return res.status(401).json({ error: "そのユーザは存在しません"});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({ error: "パスワードが間違っています"});
    }


    const token = jwt.sign({ id: user.id }, 
        process.env.SECRET_KEY, 
        { expiresIn: "1d" });

    return res.json({ token });
});

module.exports = router;