import NextLink from 'next/link'
import { fetchOrdersHistory, orderReducer } from '../lib/order'
import { useContext, useEffect, useReducer } from 'react';
import { Store } from '../lib/store'
import { useRouter } from 'next/router';
import { Button, Card, CardContent, CircularProgress, Grid, List, ListItem, ListItemText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
export default function History() {
    const { state } = useContext(Store)
    const [{ loading, error, orders }, dispach] = useReducer(orderReducer, { orders: [], loading: true, error: '' })
    const router = useRouter()
    useEffect(() => {
        if (!state.user) {
            router.push('/login')
        }
        fetchOrdersHistory(state.user, dispach)
    }, [])
    return (
        <Grid container spacing={1} mt={4}>
            <Grid item xs={12} md={3}>
                <Card>
                    <List>
                        <NextLink passHref href="/profile">
                            <ListItem button component="a">
                                <ListItemText >Profile d'utilisateur</ListItemText>
                            </ListItem>
                        </NextLink>
                        <NextLink passHref href="/order-history">
                            <ListItem button selected  component="a">
                                <ListItemText >Historique de commandes</ListItemText>
                            </ListItem>
                        </NextLink>
                    </List>
                </Card>
            </Grid>
            <Grid item xs={12} md={9}>
                <Card>
                    <CardContent>
                        <List>
                            <ListItem>
                                <Typography variant="h5" >Historique des commandes</Typography>
                            </ListItem>
                            <ListItem>
                                {
                                    loading ? (<CircularProgress />) :
                                        error ? (<Typography>{error}</Typography>)
                                            : (
                                                <TableContainer>
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>ID</TableCell>
                                                                <TableCell>Date</TableCell>
                                                                <TableCell>Total</TableCell>
                                                                <TableCell>Payer</TableCell>
                                                                <TableCell>Délivrer</TableCell>
                                                                <TableCell>Action</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {
                                                                orders.map(order => {
                                                                    return <TableRow key={order._id}>
                                                                        <TableCell>{order._id.substring(20, 24)}</TableCell>
                                                                        <TableCell>{order.createdAt.substring(0, 10)}</TableCell>
                                                                        <TableCell>${order.totalPrice}</TableCell>
                                                                        <TableCell>
                                                                            {
                                                                                order.isPaid ? order.paidAt.substring(0, 10) : 'Non payer'
                                                                            }
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {
                                                                                order.isDelivered ? order.deliveredAt.substring(0, 10) : 'Non délivrer'
                                                                            }
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <NextLink passHref href={`orders/${order._id}`}>
                                                                                <Button variant="contained" color="success">Detail</Button>
                                                                            </NextLink>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                })
                                                            }
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            )
                                }

                            </ListItem>
                        </List>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}