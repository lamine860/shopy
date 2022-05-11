import axios from "axios"
import { getError } from './errors'


export function summaryReducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' }
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, error: '', summary: action.payload }
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload }
    }
}
export function fetchAdminDasbordSummary(state) {
    return async function (dispatch) {
        dispatch({ type: 'FETCH_REQUEST' })
        try {
            const { data } = await axios.get(`/api/admin/summary`, {
                headers: {
                    'authorization': `Bearer ${state.user?.token}`
                }
            })
            dispatch({ type: 'FETCH_SUCCESS', payload: data })
        } catch (e) {
            dispatch({ type: 'FETCH_FAIL', payload: getError(e) })
        }
    }
}

export function redirectIfNotIsAdminUser(router, state) {
    if (!state.user?.isAdmin) router.push('/')
}