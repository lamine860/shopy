import dinamic from "next/dynamic"
import { useRouter } from "next/router"
import { useContext, useEffect } from "react"
import { Store } from "../lib/store"

export default function Shipping(props) {
    const { state, dispatch } = useContext(Store)
    const { user } = state
    const router = useRouter()
    useEffect(() => {
        !user && router.push('/login?redirect=shipping')

    }, [])
    return (
        <h1>Shipping</h1>
    )
}

