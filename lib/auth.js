import jwt from "jsonwebtoken"
export const getToken = (user) => {
    return jwt.sign({
        _id: user._id,
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin,
    }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}