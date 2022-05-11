import nc from 'next-connect'
import { onError } from '../../../lib/errors'
import { getToken, isAuth } from '../../../lib/auth'
import db from '../../../lib/db'
import User from '../../../models/User'
import bcryptjs from 'bcryptjs'

const handler = nc({
    onError: onError
})

handler.use(isAuth)

handler.put(async (req, res) => {
    db.connect()
    const user = await User.findById(req.user._id)
    user.username = req.body.username
    user.email = req.body.email
    user.password = req.body.password ? bcryptjs.hashSync(req.body.password) : user.password
    await user.save()
    db.disconnect()
    const token = getToken(user)
    res.send({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        token
    })

})

export default handler