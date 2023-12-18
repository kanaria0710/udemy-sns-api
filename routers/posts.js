const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const isAuthenticated = require("../middlewares/isAuthenticated");

const prisma = new PrismaClient();

//呟き投稿用API
router.post("/post", isAuthenticated, async (req, res) => {
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({message: "投稿内容が空です"});
    }

    try {
        const newPost = await prisma.post.create({
            data: {
                content,
                authorId: req.userId,
            },
            include: { 
                author: {
                    include: {
                        profile: true,
                    }
                }
            },
        });

        res.status(200).json(newPost);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "サーバーエラーです"});
    }
});

// 最新呟き取得用API
router.get("/getlatestposts", async (req, res) => {
    try {
        const latestPosts = await prisma.post.findMany({
            take: 10,
            orderBy: {
                createdAt: "desc",
            },
            include: { 
                author: {
                    include: {
                        profile: true,
                    }
                }
            },
        });
        return res.status(200).json(latestPosts);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "サーバーエラーです"});
    }
});

//閲覧してるユーザの呟き取得用API
router.get("/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        const userPosts = await prisma.post.findMany({
            where: {
                authorId: parseInt(userId),
            },
            orderBy: {
                createdAt: "desc"
            },
            include: {
                author: true,
            },
        });
        return res.status(200).json(userPosts);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "サーバーエラーです"});
    }
});

module.exports = router;