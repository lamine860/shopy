import db from '../../lib/db'
import Product from '../../models/product'
import data from '../../lib/data'


export default async function handler(req, res) {
    db.connect()
    await Product.deleteMany()
    await Product.insertMany(data.products)
    db.disconnect()
    res.json({
        message: 'seeded successfully'
    })
}