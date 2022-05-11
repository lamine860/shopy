import nc from 'next-connect'
import { onError } from '../../../../lib/errors'
import { isAdmin, isAuth } from '../../../../lib/auth'
import db from '../../../../lib/db'
import Product from '../../../../models/product'

const handler = nc({
    onError: onError
})
handler.use(isAuth, isAdmin)

handler.post(async (req, res) => {
    db.connect()
    const newProduct = new Product({
        name: 'Produit nom',
        slug: 'Product-slug' + Math.random(),
        image: '/images/shirt1.jpg',
        price: 0,
        category: 'Product category',
        brand: 'Product brand',
        countInStock: 0,
        description: 'Product description',
        raiting: 0,
        numReviews: 0

    })
    const product = await newProduct.save()
    db.disconnect()
    res.send(product)

})
handler.get(async (req, res) => {
    db.connect()
    const products = await Product.find({})
    db.disconnect()
    res.send(products)

})

export default handler

