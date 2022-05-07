import nc from 'next-connect'
import { isAuth } from '../../../lib/auth'
import db from "../../../lib/db"
import { onError } from '../../../lib/errors'
import Order from '../../../models/Order'

const handler = nc({
    onError: onError
})
handler.use(isAuth)

handler.post(async (req, res) => {
    await db.connect()
    const newOrder = new Order(
        {
            user: req.user._id,
            ...req.body
        }
    )
    const order = await newOrder.save()
    await db.disconnect()
    res.status(201).send(order)
})

export default handler