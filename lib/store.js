import Cookies from 'js-cookie'
import { createContext, useReducer } from 'react'



export const Store = createContext()
const initialState = {
    darkMode: Cookies.get('shopy-dark-mode') === 'on' ? true : false,
    cart: {
        cartItems: Cookies.get('shopy-cartItems') ? JSON.parse(Cookies.get('shopy-cartItems')) : []
    },
    user: Cookies.get('shopy-user') ? JSON.parse(Cookies.get('shopy-user')) : null

}
function reducer(state, action) {
    switch (action.type) {
        case 'DARK_MODE_ON':
            return { ...state, darkMode: true }
        case 'DARK_MODE_OFF':
            return { ...state, darkMode: false }
        case 'ADD_TO_CART':
            const newItem = action.payload
            let cartItems = state.cart.cartItems
            const existItem = cartItems.find(i => i._id === newItem._id)
            cartItems = existItem ? cartItems.map(i => i._id === newItem._id ? newItem : i) : [...cartItems, newItem]
            Cookies.set('shopy-cartItems', JSON.stringify(cartItems))
            return { ...state, cart: { ...state.cart, cartItems: cartItems } }
        case 'REMOVE_FROM_CART':
            const filtredCartItems = state.cart.cartItems.filter(i => i._id !== action.payload)
            Cookies.set('shopy-cartItems', JSON.stringify(filtredCartItems))
            return {
                ...state, cart: { ...state.cart, cartItems: filtredCartItems }
            }
        case 'USER_LOGIN':
            Cookies.set('shopy-user', JSON.stringify(action.payload))
            return {
                ...state, user: action.payload
            }
        default:
            return state

    }

}

export function StoreProvider(props) {
    const [state, dispatch] = useReducer(reducer, initialState)
    const value = { state, dispatch }
    return <Store.Provider value={value}>{props.children}</Store.Provider>
}