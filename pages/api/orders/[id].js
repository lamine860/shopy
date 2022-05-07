import db from "../../../lib/db"
import Order from "../../../models/Order"
import nc from 'next-connect'
import { onError } from "../../../lib/errors"
import { isAuth } from "../../../lib/auth"

const handler = nc({
    onError: onError
})
handler.use(isAuth)

handler.get(async (req, res) => {
    await db.connect()
    let order
    try {

        order = await Order.findById(req.query.id)
        if (!order) return res.status(404).json({ message: 'Commande introuvable' })
    } catch (e) {
        return res.status(404).json({ message: 'Commande introuvable' })
    }
    db.disconnect()
    return res.json(order)
})

export default handler