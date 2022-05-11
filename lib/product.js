import axios from "axios"
import { getError } from "./errors"

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


export function productReducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' }
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, error: '', products: action.payload }
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload }
        case 'DELETE_REQUEST':
            return { ...state, deleteLoadin: true, deleteError: '' }
        case 'DELETE_SUCCESS':
            return { ...state, deleteLoadin: false, deleteError: '', products: state.products.filter(i => i._id !== action.payload) }
        case 'DELETE_FAIL':
            return { ...state, deleteLoadin: false, deleteError: action.payload }
        case 'CREATE_REQUEST':
            return { ...state, createLoadin: true, createError: '' }
        case 'CREATE_SUCCESS':
            return { ...state, createLoadin: false, createError: '' }
        case 'CREATE_FAIL':
            return { ...state, createLoadin: false, createError: action.payload }
        case 'UPLOAD_REQUEST':
            return { ...state, uploadLoadin: true, uploadError: '' }
        case 'UPLOAD_SUCCESS':
            return { ...state, uploadLoadin: false, uploadError: '' }
        case 'UPLOAD_FAIL':
            return { ...state, uploadLoadin: false, uploadError: action.payload }
        case 'FETCH_PRODUCT_REQUEST':
            return { ...state, productLoading: true, productError: '' }
        case 'FETCH_PRODUCT_SUCCESS':
            return { ...state, productLoading: false, productError: '', product: action.payload }
        case 'FETCH_PRODUCT_FAIL':
            return { ...state, productLoading: false, productError: action.payload }
        case 'UPDATE_PRODUCT_REQUEST':
            return { ...state, updateProductLoading: true, updateProductError: '' }
        case 'UPDATE_PRODUCT_SUCCESS':
            return { ...state, updateProductLoading: false, updateProductError: '', product: action.payload }
        case 'UPDATE_PRODUCT_FAIL':
            return { ...state, updateProductLoading: false, updateProductError: action.payload }
    }
}

export async function fetchProductsAdmin(user, dispatch) {
    dispatch({ type: 'FETCH_REQUEST' })
    try {
        const { data } = await axios.get(`/api/admin/products`, {
            headers: {
                'authorization': `Bearer ${user.token}`
            }
        })
        dispatch({ type: 'FETCH_SUCCESS', payload: data })
    } catch (e) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(e) })
    }
}
export function deleteAdminProduct(productId, state, dispatch) {
    return async (cb) => {
        dispatch({ type: 'DELETE_REQUEST' })
        try {
            const { data } = await axios.delete(`/api/admin/products/${productId}`, {
                headers: {
                    'authorization': `Bearer ${state.user.token}`
                }
            })
            dispatch({ type: 'DELETE_SUCCESS', payload: productId })
            cb(false, data.message)
        } catch (e) {
            dispatch({ type: 'DELETE_FAIL', payload: getError(e) })
            cb(getError(e))
        }
    }
}
export async function createAdminProduct(state, dispatch, router) {
    dispatch({ type: 'CREATE_REQUEST' })
    try {
        const { data } = await axios.post(`/api/admin/products`, {}, {
            headers: {
                'authorization': `Bearer ${state.user.token}`
            }
        })
        dispatch({ type: 'CREATE_SUCCESS' })
        router.push(`/admin/products/${data._id}`)
    } catch (e) {
        dispatch({ type: 'CREATE_FAIL', payload: getError(e) })
    }
}

export async function uploadProductFile(fileData, state, dispatch, cp) {
    dispatch({ type: 'UPLOAD_REQUEST' })
    try {
        const { data } = await axios.post(`/api/admin/upload`, fileData, {
            headers: {
                'content-type': 'multipart/form-data',
                'authorization': `Bearer ${state.user.token}`
            }
        })
        dispatch({ type: 'UPLOAD_SUCCESS' })
        cp(false, data)
    } catch (e) {
        dispatch({ type: 'UPLOAD_FAIL', payload: getError(e) })
        cp(getError(e))
    }
}

export async function fetchAdminProductById(productId, state, dispatch, cb) {
    dispatch({ type: 'FETCH_PRODUCT_REQUEST' })
    try {
        const { data } = await axios.get(`/api/admin/products/${productId}`, {
            headers: {
                'authorization': `Bearer ${state.user.token}`
            }
        })
        dispatch({ type: 'FETCH_PRODUCT_SUCCESS', payload: data })
        cb(data)
    } catch (e) {
        dispatch({ type: 'FETCH_PRODUCT_FAIL', payload: getError(e) })
    }
}
export async function updateAdminProductById(productId, userData, state, dispatch, cb) {
    dispatch({ type: 'UPDATE_PRODUCT_REQUEST' })
    try {
        const { data } = await axios.put(`/api/admin/products/${productId}`, userData, {
            headers: {
                'authorization': `Bearer ${state.user.token}`
            }
        })
        dispatch({ type: 'UPDATE_PRODUCT_SUCCESS', payload: data })
        cb(false)
    } catch (e) {
        dispatch({ type: 'UPDATE_PRODUCT_FAIL', payload: getError(e) })
        cb(getError(e))
    }
}