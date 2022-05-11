import nc from 'next-connect'
import { onError } from '../../../lib/errors'
import { isAdmin, isAuth } from '../../../lib/auth'
import db from '../../../lib/db'
import Order from '../../../models/Order'
import Product from '../../../models/product'
import User from '../../../models/User'

const handler = nc({
    onError: onError
})
handler.use(isAuth, isAdmin)

handler.get(async (req, res) => {
    db.connect()
    const ordersCount = await Order.countDocuments()
    const productsCount = await Product.countDocuments()
    const usersCount = await User.countDocuments()
    const orderPriceGroup = await Order.aggregate([
        {
            $group: {
                _id: null,
                sales: { $sum: '$totalPrice' }
            }
        }
    ])
    const ordersPrice = orderPriceGroup.length > 0 ? orderPriceGroup[0].sales : 0
    const salesData = await Order.aggregate([
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                totalSales: { $sum: '$totalPrice' }
            }
        }
    ])
    db.disconnect()
    res.send({ordersCount, productsCount, usersCount, ordersPrice, salesData})
})

export default handler

