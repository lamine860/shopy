import Cookies from "js-cookie"
import { Store } from "../lib/store"
import { useSnackbar } from 'notistack'
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import CheckoutWizard from "../components/CheckoutWizard"
import { savePaymentMethod } from "../lib/utils"
import { Box, Button, FormControl, FormControlLabel, List, ListItem, Radio, RadioGroup, Typography } from "@mui/material"

export default function Payment(props) {
    const [paymentMethod, setPaymentMethod] = useState('')
    const { state, dispatch } = useContext(Store)
    const { user, shippingAddress } = state
    const router = useRouter()
    const { closeSnackbar, enqueueSnackbar } = useSnackbar()
    const handleSubmit = (e) => {
        e.preventDefault()
        closeSnackbar()
        if (!paymentMethod) {
            enqueueSnackbar('Le methode de payment est requis', { variant: 'error' })
        } else {
            savePaymentMethod(paymentMethod)(dispatch)
            router.push('/place-order')
        }
    }
    useEffect(() => {
        if (!shippingAddress.address) {
            router.push('/shipping')
        } else {
            setPaymentMethod(JSON.parse(Cookies.get('shopy-paymentMethod')) || '')
        }
    }, [])
    return (
        <>
            <CheckoutWizard step={2} />
            <Box sx={{
                width: '80%',
                margin: '0 auto',
                mt: 4
            }}>
                <form onSubmit={handleSubmit}>
                    <Typography variant="h6" component="h1" >Methode de payment</Typography>

                    <List>
                        <ListItem>
                            <FormControl component="fieldset">
                                <RadioGroup aria-label="Payment Method"
                                    name="paymentMethod"
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}>
                                    <FormControlLabel
                                        label="PayPal"
                                        value="PayPal"

                                        control={<Radio />}
                                    ></FormControlLabel>
                                    <FormControlLabel
                                        label="Stripe"
                                        value="Stripe"
                                        control={<Radio />}
                                    ></FormControlLabel>
                                    <FormControlLabel
                                        label="Cash"
                                        value="Cash"
                                        control={<Radio />}
                                    ></FormControlLabel>
                                </RadioGroup>
                            </FormControl>
                        </ListItem>
                        <ListItem>
                            <Button type="submit" variant="contained" fullWidth>Continuez</Button>
                        </ListItem>
                        <ListItem>
                            <Button onClick={() => router.push('/shipping')} variant="contained" color="warning" fullWidth>Arrière</Button>
                        </ListItem>
                    </List>
                </form>
            </Box>
        </>
    )
}

