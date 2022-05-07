import nc from 'next-connect'
import { isAuth } from '../../../../lib/auth'
import db from '../../../../lib/db'
import { onError } from '../../../../lib/errors'
import Order from '../../../../models/Order'

const handler = nc({
    onError: onError
})

handler.use(isAuth)

handler.put(async (req, res) => {
    db.connect()
    const order = await Order.findById(req.query.id)
    if (order) {
        order.isDelivered = true
        order.deliveredAt = Date.now()
        const deliveredOrder = await order.save()
        db.disconnect()
        res.send({ message: 'La commande est délivre', order: deliveredOrder })
    } else {
        db.disconnect()
        res.status(404).send({ message: 'Commande introuvable' })
    }
})

export default handler