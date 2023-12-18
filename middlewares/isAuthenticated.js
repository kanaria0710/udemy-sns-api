const jwt = require("jsonwebtoken");

function isAuthenticated(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        console.log("権限がありません");
        return res.status(401).json({ message: "権限がありません"})
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            console.log("権限がありませんyo");
            return res.status(401).json({ message: "権限がありません"});
        }

        req.userId = decoded.id;

        next();
    });
}
module.exports = isAuthenticated;