import axios from "axios"
import { getError } from "./errors"

export const loginUser = (user) => async (dispach, cb) => {
    try {
        const { data } = await axios.post('/api/users/login', user)
        dispach({ type: 'USER_LOGIN', payload: data })
        return cb(false)
    } catch (e) {
        cb(true, getError(e))
    }

}

export const registerUser = (user) => async (dispach, cb) => {
    try {
        const { data } = await axios.post('/api/users/register', user)
        dispach({ type: 'USER_LOGIN', payload: data })
        return cb(false)
    } catch (e) {
        cb(true, getError(e))
    }

}