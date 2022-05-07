import { Store } from "../../lib/store"
import { useContext, useEffect, useState } from "react"
import { getKeyFromUrl } from "../../lib/utils"
import Image from "next/image"
import NextLink from 'next/link'
import { findOrderById, updateOrderAsDeliver, updateOrderAsPaid } from "../../lib/order"
import { getError } from "../../lib/errors"
import { useSnackbar } from "notistack"
import { Button, Card, CardContent, Grid, Link, List, ListItem, Table, CircularProgress, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Alert } from "@mui/material"
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { get } from "react-hook-form"
export default function Order({ params }) {
    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const orderId = params.id
    const { state, dispatch } = useContext(Store)
    const [order, setOrder] = useState({})
    const [error, setError] = useState()
    const [isPaid, setIsPaid] = useState(false)
    const [isDelivered, setIsDelivered] = useState(false)
    const [user, setUser] = useState({})


    useEffect(() => {
        setUser(state.user)
        if (orderId !== order._id || isPaid || isDelivered) {
            findOrderById(orderId, state.user).then(res => setOrder(res.data))
                .catch(err => setError(getError(err)))
        }
        const loadPaypalScript = () => {
            getKeyFromUrl('/api/keys/paypal', state.user).then(res => {
                paypalDispatch({
                    type: 'resetOptions',
                    value: {
                        "client-id": res.data,
                        currency: 'USD'
                    }
                })
                paypalDispatch({
                    type: 'setLoadingStatus',
                    value: 'pending'
                })
            }).catch(err => {

            })
        }
        loadPaypalScript()
    }, [])
    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: { value: order.totalPrice }
                }

            ]
        }).then(orderId => {
            return orderId
        })

    }
    const onApprove = (data, actions) => {
        closeSnackbar()
        actions.order.capture().then(async (details) => {
            updateOrderAsPaid(orderId, details, state.user).then(res => {
                enqueueSnackbar(res.data.message, { variant: 'success' })
                setOrder(res.data.order)
                setIsPaid(true)
            }).catch(err => enqueueSnackbar(res.data.message, { variant: 'error' }))
        })

    }
    const onError = (err) => {
        enqueueSnackbar(getError(err), { variant: 'error' });

    }
    const orderDeliverHandler = () => {
        updateOrderAsDeliver(orderId, state.user).then(res => {
            setOrder(res.data.order)
            setIsDelivered(true)
        }).catch(err => enqueueSnackbar(getError(err), { variant: 'error' }))
    }
    return (
        <>
            <Typography variant="h4" component="h1" ml={4} mt={4} >Commande {orderId}</Typography>
            {
                error ? (
                    <Alert severity="error">{error}</Alert>
                ) : (
                    <Grid container spacing={1} >
                        <Grid item xs={12} md={9}>
                            <List>
                                <ListItem>
                                    <Card sx={{ width: "100%" }}>
                                        <CardContent>
                                            <Typography variant="h6" mb={2}>Adresse de livraison</Typography>
                                            <List>
                                                <ListItem>
                                                    {order.shippingAddress?.fullName} {order.shippingAddress?.address} {' '}
                                                    {order.shippingAddress?.city} {order.shippingAddress?.postalCode} {' '}
                                                    {order.shippingAddress?.country}
                                                </ListItem>
                                                <ListItem>
                                                    Status:
                                                    {
                                                        order.isDelivered ? ` Déllivrer le ${order.deliveredAt.substring(0,10)}` : ' Non délivrer'
                                                    }
                                                </ListItem>
                                            </List>

                                        </CardContent>
                                    </Card>
                                </ListItem>
                                <ListItem>
                                    <Card sx={{ width: "100%" }}>
                                        <CardContent>
                                            <Typography variant="h6" mb={2}>Methode de payment</Typography>

                                            <List>
                                                <ListItem>{order.paymentMethod}</ListItem>
                                                <ListItem>
                                                    Status:
                                                    {
                                                        order.isPaid ? `Payer le ${order.paidAt.substring(0,10)}` : ' Non payer'
                                                    }
                                                </ListItem>
                                            </List>
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
                                                            order.orderItems?.map(item => {
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
                                                    <Typography>${order.itemsPrice}</Typography>
                                                </Grid>
                                            </Grid>
                                        </ListItem>
                                        <ListItem>
                                            <Grid container>
                                                <Grid item xs={6}>
                                                    <Typography>Tax</Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography>${order.tax}</Typography>
                                                </Grid>
                                            </Grid>
                                        </ListItem>
                                        <ListItem>
                                            <Grid container>
                                                <Grid item xs={6}>
                                                    <Typography>Livraison</Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography>${order.shippingPrice}</Typography>
                                                </Grid>
                                            </Grid>
                                        </ListItem>
                                        <ListItem>
                                            <Grid container>
                                                <Grid item xs={6}>
                                                    <Typography>Total</Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography>${order.totalPrice}</Typography>
                                                </Grid>
                                            </Grid>
                                        </ListItem>
                                        <ListItem>
                                            {

                                                !order.isPaid && (
                                                    isPending ? <CircularProgress /> : <PayPalButtons createOrder={createOrder} onApprove={onApprove} onError={onError} />
                                                )

                                            }
                                        </ListItem>
                                        {
                                            order.isPaid && user.isAdmin && !order.isDelivered && <ListItem>
                                                <Button variant="contained" fullWidth color="warning" onClick={orderDeliverHandler}>Delivrer</Button>
                                            </ListItem>
                                        }
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                )
            }

        </>
    )
}

export async function getServerSideProps({ params }) {
    return { props: { params } };
}
