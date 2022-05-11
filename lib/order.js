import axios from "axios"
import { getError } from "./errors"

export function placeOrder(order) {
    return async function (dispach, user, cb) {
        try {
            const { data } = await axios.post('/api/orders', order, {
                headers: {
                    'authorization': `Bearer ${user.token}`
                }
            })
            dispach({ type: 'CLEAR_CART' })
            cb(false, data)

        } catch (e) {
            cb(getError(e))
        }
    }
}

export async function findOrderById(orderId, user) {
    return axios.get(`/api/orders/${orderId}`, {
        headers: {
            'authorization': `Bearer ${user.token}`
        }
    })
}


export async function updateOrderAsPaid(orderId, details, user) {
    return axios.put(`/api/orders/${orderId}/pay`, details, {
        headers: {
            'authorization': `Bearer ${user.token}`
        }
    })
}

export async function updateOrderAsDeliver(orderId, user) {
    return axios.put(`/api/orders/${orderId}/deliver`, {}, {
        headers: {
            'authorization': `Bearer ${user.token}`
        }
    })
}

export function orderReducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' }
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, error: '', orders: action.payload }
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload }
    }
}

export async function fetchOrdersHistory(user, dispatch) {
    dispatch({ type: 'FETCH_REQUEST' })
    try {
        const { data } = await axios.get(`/api/orders/history`, {
            headers: {
                'authorization': `Bearer ${user.token}`
            }
        })
        dispatch({ type: 'FETCH_SUCCESS', payload: data })
    } catch (e) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(e) })
    }
}

export async function fetchOrdersAdmin(user, dispatch) {
    dispatch({ type: 'FETCH_REQUEST' })
    try {
        const { data } = await axios.get(`/api/admin/orders`, {
            headers: {
                'authorization': `Bearer ${user.token}`
            }
        })
        dispatch({ type: 'FETCH_SUCCESS', payload: data })
    } catch (e) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(e) })
    }
}