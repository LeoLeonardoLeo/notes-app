const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
    const header = req.headers.authorization
    
    //if no header, or doesnt start with bearer
    if (!header || !header.startsWith("Bearer ")){
        return res.status(401).json({message: "Unauthorized, no token"})
    }

    //take the string from header and split Bearer and the token
    const token = header.split(" ")[1]

    try{
        //decode token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    }
    catch (error){
        if (error.name === "TokenExpiredError"){
            return res.status(401).json({message: "Token expired"})
        }
        else{
            return res.status(401).json({message: "Invalid token"})
        }
    }
}

module.exports = { verifyToken }