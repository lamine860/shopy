import nc from 'next-connect'
import { isAuth } from '../../../lib/auth'
import db from '../../../lib/db'
import { onError } from '../../../lib/errors'
import Order from '../../../models/Order'

const handler = nc({
    onError: onError
})

handler.use(isAuth)

handler.get(async (req, res) => {
    db.connect()
    const order = await Order.find({ user: req.user._id })
    db.disconnect()
    res.send(order)
})

export default handler