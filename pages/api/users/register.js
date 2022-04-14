import bcryptjs from 'bcryptjs'
import db from '../../../lib/db'
import User from '../../../models/User'
import { getToken } from '../../../lib/auth'


export default async function handler(req, res) {
    await db.connect()
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcryptjs.hashSync(req.body.password)
    })
    const user = await newUser.save()
    await db.disconnect()
    if (user) {
        const token = getToken(user)
        return res.json({
            _id: user._id,
            email: user.email,
            username: user.username,
            isAdmin: user.isAdmin,
            token: token
        })
    } else {
        res.status(402).json({ 'message': 'Information invalide !' })
    }
}