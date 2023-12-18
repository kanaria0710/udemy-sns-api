const router = require('express').Router();
const { PrismaClient } = require("@prisma/client");
const isAuthenticated = require("../middlewares/isAuthenticated");

const prisma = new PrismaClient();

router.get("/find", isAuthenticated, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {id: req.userId},
        })

        if (!user) {
            res.status(404).json({ error: "ユーザーが見つかりません" });
        }
        res.status(200).json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/profile/:id", async (req, res) => {
    const {id} = req.params;

    try {
        const profile = await prisma.profile.findUnique({
            where: { userId: parseInt(id) },
            include: { 
                user: {
                    include: {
                        profile: true,
                }
            }}
        });
        if (!profile) {
            return res.status(404).json({ error: "プロフィールが見つかりませんでした" });
        }
        res.status(200).json(profile);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;
