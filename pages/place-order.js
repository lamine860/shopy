import { Store } from "../lib/store"
import { useSnackbar } from 'notistack'
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import CheckoutWizard from "../components/CheckoutWizard"
import { } from "../lib/utils"
import Image from "next/image"
import NextLink from 'next/link'
import { Button, Card, CardContent, Grid, Link, List, ListItem, Table, CircularProgress, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { placeOrder } from "../lib/order"
import { route } from "next/dist/server/router"

export default function Order(props) {
    const { closeSnackbar, enqueueSnackbar } = useSnackbar()
    const { state, dispatch } = useContext(Store)
    const [shippingAddress, setShippingAddress] = useState({})
    const [paymentMethod, setPaymentMethod] = useState()
    const [cartItems, setCartItems] = useState([])
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState([])
    const router = useRouter()
    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
    const itemsPrice = round2(cartItems.reduce((prev, current) => {
        return prev + current.price * current.quantity
    }, 0))
    const tax = round2((itemsPrice * 0.15))
    const shippingPrice = itemsPrice > 200 ? 0 : 15
    const totalPrice = round2(itemsPrice + tax + shippingPrice)
    const placeOrderHandler = async () => {
        closeSnackbar()
        setLoading(true)
        const status = await placeOrder({ shippingAddress, shippingPrice, paymentMethod, totalPrice, itemsPrice, tax, orderItems: cartItems })
            (dispatch, user, (err, order) => {
                if (!err) {
                    setLoading(false)
                    router.push(`/orders/${order._id}`)
                } else {
                    setLoading(false)
                    enqueueSnackbar(err, { variant: 'error' })
                }
            })

    }
    useEffect(() => {
        setShippingAddress(state.shippingAddress)
        setPaymentMethod(state.paymentMethod)
        setCartItems(state.cart.cartItems)
        setUser(state.user)

    }, [state])
    return (
        <>
            <CheckoutWizard step={3} />
            <Typography variant="h4" component="h1" ml={4} mt={4} >Passer une commade</Typography>
            <Grid container spacing={1} >
                <Grid item xs={12} md={9}>
                    <List>
                        <ListItem>
                            <Card sx={{ width: "100%" }}>
                                <CardContent>
                                    <Typography variant="h6" mb={2}>Adresse de livraison</Typography>
                                    {shippingAddress?.fullName} {shippingAddress?.address} {' '}
                                    {shippingAddress?.city} {shippingAddress?.postalCode} {' '}
                                    {shippingAddress?.country}
                                </CardContent>
                            </Card>
                        </ListItem>
                        <ListItem>
                            <Card sx={{ width: "100%" }}>
                                <CardContent>
                                    <Typography variant="h6" mb={2}>Methode de payment</Typography>
                                    {paymentMethod}
                                </CardContent>
                            </Card>
                        </ListItem>
                        <ListItem>
                            <Card sx={{ width: "100%" }}>
                                <CardContent>
                                    <Typography variant="h6" mb={2}>Liste des produits</Typography>
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Image</TableCell>
                                                    <TableCell>Nom</TableCell>
                                                    <TableCell align="right">Quantité</TableCell>
                                                    <TableCell align="right">Prix</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    cartItems.map(item => {
                                                        return <TableRow key={item._id}>
                                                            <TableCell><NextLink href={`/product/${item.slug}`} passHref>
                                                                <Link><Image src={item.image} alt={item.name} width={100} height={100} /></Link>
                                                            </NextLink>
                                                            </TableCell>
                                                            <TableCell>
                                                                <NextLink href={`/product/${item.slug}`} passHref>
                                                                    <Link>
                                                                        <Typography>{item.name}</Typography>
                                                                    </Link>
                                                                </NextLink>
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <Typography>{item.quantity}</Typography>
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <Typography>${item.price}</Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    })
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        </ListItem>
                    </List>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card sx={{ width: "100%" }}>
                        <CardContent>
                            <Typography>Detail de la commande</Typography>
                            <List>
                                <ListItem>
                                    <Grid container>
                                        <Grid item xs={6}>
                                            <Typography>Produits</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography>${itemsPrice}</Typography>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                                <ListItem>
                                    <Grid container>
                                        <Grid item xs={6}>
                                            <Typography>Tax</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography>${tax}</Typography>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                                <ListItem>
                                    <Grid container>
                                        <Grid item xs={6}>
                                            <Typography>Livraison</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography>${shippingPrice}</Typography>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                                <ListItem>
                                    <Grid container>
                                        <Grid item xs={6}>
                                            <Typography>Total</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography>${totalPrice}</Typography>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                                <ListItem>
                                    <Button onClick={placeOrderHandler} variant="contained" fullWidth>Commader</Button>
                                </ListItem>
                                {
                                    loading && <ListItem>
                                        <CircularProgress />
                                    </ListItem>
                                }
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    )
}

