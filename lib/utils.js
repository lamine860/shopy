import axios from "axios"
import Cookies from "js-cookie"

export function switchDarkMode(dark) {
    return function (dispatch) {
        dispatch({ type: !dark ? 'DARK_MODE_ON' : 'DARK_MODE_OFF' })
        Cookies.set('shopy-dark-mode', !dark ? 'ON' : 'OFF')

    }
}

export function logoutUser() {
    return function (dispatch) {
        dispatch({ type: 'USER_LOGOUT' })
    }
}

export function saveShippingAddress(shippingAddress) {
    return function (dispatch) {
        dispatch({ type: 'SAVE_SHIPPING_ADDRESS', payload: shippingAddress })
    }
}

export function savePaymentMethod(paymentMethod) {
    return function (dispatch) {
        dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethod })
    }
}

export async function getKeyFromUrl(url, user) {
    return axios.get(url, {
        headers: {
            'Authorization': `Bearer ${user.token}`
        }
    })
}