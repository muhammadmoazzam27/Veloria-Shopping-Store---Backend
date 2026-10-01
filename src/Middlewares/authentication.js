const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.Secret_key

const verifyToken = async (req, res, next) => {

    try {

        const authHeader = req?.headers?.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: "Unauthorized user", isError: true })
        }

        const token = await authHeader.split(" ")[1];

        if (!token) {
            return res.status(400).json({ message: "Invalid Token", isError: true })
        }

        const decoded = await jwt.verify(token, SECRET_KEY)

        req.uid = decoded.uid;
        req.role = decoded.role;
        req.user = decoded.user

        next();

    }
    catch (error) {
        console.log("error", error)
        return res.status(500).json({ message: "Invalid token", isError: true })
    }

}


module.exports = { verifyToken }