import nc from 'next-connect'
import { onError } from '../../../../lib/errors'
import { isAdmin, isAuth } from '../../../../lib/auth'
import db from '../../../../lib/db'
import Product from '../../../../models/product'

const handler = nc({
    onError: onError
})
handler.use(isAuth, isAdmin)

handler.get(async (req, res) => {
    db.connect()
    const product = await Product.findById(req.query.id)
    db.disconnect()
    res.send(product)

})
handler.put(async (req, res) => {
    db.connect()
    const product = await Product.findById(req.query.id)
    if (product) {
        product.name = req.body.name;
        product.slug = req.body.slug;
        product.price = req.body.price;
        product.category = req.body.category;
        product.image = req.body.image;
        product.featuredImage = req.body.featuredImage;
        product.isFeatured = req.body.isFeatured;
        product.brand = req.body.brand;
        product.countInStock = req.body.countInStock;
        product.description = req.body.description;
        await product.save();
        db.disconnect()
        res.send(product)

    } else {
        await db.disconnect();
        res.status(404).send({ message: 'Produit introuvable' });
    }
})

handler.delete(async (req, res) => {
    db.connect()
    const product = await Product.findById(req.query.id)
    if (product) {
        await product.remove()
        db.disconnect()
        res.send({ message: 'Le produit a été supprimé' })
    } else {
        db.disconnect()
        res.status(404).send({ message: 'Produit introuvable' })

    }

})

export default handler

