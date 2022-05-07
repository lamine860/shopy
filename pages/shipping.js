import { Store } from "../lib/store"
import { useRouter } from "next/router"
import { useContext, useEffect } from "react"
import CheckoutWizard from "../components/CheckoutWizard"
import { List, ListItem, Typography, Box, TextField, Button } from "@mui/material"
import { Controller, useForm } from "react-hook-form"
import { saveShippingAddress } from "../lib/utils"

export default function Shipping(props) {
    const { control, handleSubmit, formState: { errors }, setValue, getValues } = useForm()
    const { state, dispatch } = useContext(Store)
    const { user, shippingAddress } = state
    const router = useRouter()
    const submitHandler = (shippingAddress) => {
        saveShippingAddress(shippingAddress)(dispatch)
        router.push('/payment')

    }
    useEffect(() => {
        !user && router.push('/login?redirect=shipping')
        setValue('fullName', shippingAddress.fullName)
        setValue('address', shippingAddress.address)
        setValue('country', shippingAddress.country)
        setValue('city', shippingAddress.city)
        setValue('postalCode', shippingAddress.postalCode)

    }, [])
    return (
        <>
            <CheckoutWizard step={1} />
            <Box sx={{
                width: '80%',
                margin: '0 auto',
                mt: 4
            }}>
                <form onSubmit={handleSubmit(submitHandler)}>
                    <Typography variant="h6" component="h1" >Adresse de livraison</Typography>
                    <List>
                        <ListItem>
                            <Controller name="fullName"
                                control={control} defaultValue=""
                                rules={{
                                    required: true,
                                }}
                                render={({ field }) => {
                                    return <TextField variant="outlined" fullWidth
                                        id="fullName" label="Nom complet"
                                        inputProps={{ type: 'text' }}
                                        error={Boolean(errors.fullName)}
                                        helperText={
                                            errors.fullName
                                                ? 'Le champs nom complet est obligatoire'
                                                : ''
                                        }
                                        {...field}
                                    >
                                    </TextField>
                                }}
                            ></Controller>
                        </ListItem>
                        <ListItem>
                            <Controller name="address"
                                control={control} defaultValue=""
                                rules={{
                                    required: true,
                                }}
                                render={({ field }) => {
                                    return <TextField variant="outlined" fullWidth
                                        id="address" label="Adresse"
                                        inputProps={{ type: 'text' }}
                                        error={Boolean(errors.address)}
                                        helperText={
                                            errors.address
                                                ? 'Le champs adresse est obligatoire'
                                                : ''
                                        }
                                        {...field}
                                    >
                                    </TextField>
                                }}
                            ></Controller>
                        </ListItem>
                        <ListItem>
                            <Controller name="country"
                                control={control} defaultValue=""
                                rules={{
                                    required: true,
                                }}
                                render={({ field }) => {
                                    return <TextField variant="outlined" fullWidth
                                        id="country" label="Pays"
                                        inputProps={{ type: 'text' }}
                                        error={Boolean(errors.country)}
                                        helperText={
                                            errors.country
                                                ? 'Le champs Pays est obligatoire'
                                                : ''
                                        }
                                        {...field}
                                    >
                                    </TextField>
                                }}
                            ></Controller>
                        </ListItem>
                        <ListItem>
                            <Controller name="city"
                                control={control} defaultValue=""
                                rules={{
                                    required: true,
                                }}
                                render={({ field }) => {
                                    return <TextField variant="outlined" fullWidth
                                        id="city" label="Ville"
                                        inputProps={{ type: 'text' }}
                                        error={Boolean(errors.city)}
                                        helperText={
                                            errors.city
                                                ? 'Le champs ville est obligatoire'
                                                : ''
                                        }
                                        {...field}
                                    >
                                    </TextField>
                                }}
                            ></Controller>
                        </ListItem>
                        <ListItem>
                            <Controller name="postalCode"
                                control={control} defaultValue=""
                                rules={{
                                    required: true,
                                }}
                                render={({ field }) => {
                                    return <TextField variant="outlined" fullWidth
                                        id="postalCode" label="Code postal"
                                        inputProps={{ type: 'text' }}
                                        error={Boolean(errors.postalCode)}
                                        helperText={
                                            errors.postalCode
                                                ? 'Le champs code postal est obligatoire'
                                                : ''
                                        }
                                        {...field}
                                    >
                                    </TextField>
                                }}
                            ></Controller>
                        </ListItem>

                        <ListItem>
                            <Button type="submit" fullWidth variant="contained">Continuez</Button>
                        </ListItem>
                    </List>

                </form>
            </Box>
        </>
    )
}

