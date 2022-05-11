import nc from 'next-connect'
import { onError } from '../../../lib/errors'
import { isAdmin, isAuth } from '../../../lib/auth'
import db from '../../../lib/db'
import Order from '../../../models/Order'

const handler = nc({
    onError: onError
})
handler.use(isAuth, isAdmin)

handler.get(async (req, res) => {
    db.connect()
    const orders = await Order.find({}).populate('user', 'username')
    db.disconnect()
    res.send(orders)

})

export default handler

