import axios from "axios"

export const addToCart = (product, quantity = null) => async (dispatch, cart, router = null) => {
    const itemsExist = cart.cartItems.find(i => i._id === product._id)
    quantity = quantity ? quantity : itemsExist?.quantity + 1 || 1
    const { data } = await axios.get(`/api/products/${product._id}`)
    if (quantity > data.countInStock) {
        window.alert('Désolé! Ce produit n\'est plu disponible.')
        return
    }
    const item = { _id: product._id, price: product.price, slug: product.slug, countInStock: product.countInStock, name: product.name, image: product.image, quantity }
    dispatch({ type: 'ADD_TO_CART', payload: item })
    if (router) {
        router.push('/cart')
    }
}

export const removeFromCart = (item) => (dispatch) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: item._id })
}

export const getTotalItem = (cartItems) => {
    return cartItems.reduce((prev, item) => { return item.quantity + prev }, 0)
}
export const getTotalPrice = (cartItems) => {
    return cartItems.reduce((prev, item) => { return item.price * item.quantity + prev }, 0)
}