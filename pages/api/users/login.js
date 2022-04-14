import bcryptjs from 'bcryptjs'
import db from '../../../lib/db'
import User from '../../../models/User'
import { getToken } from '../../../lib/auth'


export default async function handler(req, res) {
    await db.connect()
    const user = await User.findOne({ email: req.body.email })
    await db.disconnect()
    if (user && bcryptjs.compareSync(req.body.password, user.password)) {
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