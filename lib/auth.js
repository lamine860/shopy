import jwt from "jsonwebtoken"
export function getToken(user) {
    return jwt.sign({
        _id: user._id,
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin,
    }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

export async function isAuth(req, res, next) {
    const authentication = req.headers['authorization']
    if (authentication) {
        const token = authentication.slice(7, authentication.length)
        jwt.verify(token, process.env.JWT_SECRET, function (err, decode) {
            if (err) {
                return res.status(401).send({ message: 'Le token n\'est pas valide' })
            } else {
                req.user = decode
                next()
            }

        })
    } else {
        res.status(401).send({ message: 'Le token n\'est pas fournu' })
    }
}

export async function isAdmin(req, res, next) {
    if (req.user?.isAdmin) {
        next()
    } else {
        res.status(401).send({ message: 'L\'utilisateur n\'est pas administrateur' });
    }
}