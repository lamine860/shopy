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