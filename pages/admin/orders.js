import NextLink from 'next/link'
import { useReducer, useContext, useEffect } from "react";
import { Button, Card, CardActions, CardContent, CircularProgress, Grid, List, ListItem, ListItemText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { redirectIfNotIsAdminUser } from '../../lib/admin';
import { Store } from '../../lib/store';
import { useRouter } from 'next/router';
import { fetchOrdersAdmin, orderReducer } from '../../lib/order';
export default function () {
    const { state } = useContext(Store)
    const [{ loading, error, orders }, dispatch] = useReducer(orderReducer, { loading: true, error: '', orders: [] })

    const router = useRouter()
    useEffect(() => {
        redirectIfNotIsAdminUser(router, state)
        fetchOrdersAdmin(state.user, dispatch)
    }, [])
    return (
        <Grid container spacing={1} mt={4}>
            <Grid item xs={12} md={3}>
                <Card>
                    <List>
                        <NextLink passHref href="/admin/dashboard">
                            <ListItem button component="a">
                                <ListItemText>Adminstration</ListItemText>
                            </ListItem>
                        </NextLink>
                        <NextLink passHref href="/admin/orders">
                            <ListItem button selected component="a">
                                <ListItemText >Commandes</ListItemText>
                            </ListItem>
                        </NextLink>
                        <NextLink passHref href="/admin/products">
                            <ListItem button component="a">
                                <ListItemText >Produits</ListItemText>
                            </ListItem>
                        </NextLink>
                        <NextLink passHref href="/admin/users">
                            <ListItem button component="a">
                                <ListItemText >Utilisateurs</ListItemText>
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
                                <Typography variant="h1">Commandes</Typography>
                            </ListItem>
                            {
                                loading ?
                                    (<CircularProgress />)
                                    : error
                                        ? (<Typography>{error}</Typography>)
                                        : (
                                            <ListItem>
                                                <TableContainer>
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>ID</TableCell>
                                                                <TableCell>Utilisateurs</TableCell>
                                                                <TableCell>Date</TableCell>
                                                                <TableCell>Total</TableCell>
                                                                <TableCell>Payer</TableCell>
                                                                <TableCell>Délivrer</TableCell>
                                                                <TableCell>Action</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                    </Table>
                                                    <TableBody>
                                                        {
                                                            orders.map(order => {
                                                                return <TableRow key={order._id}>
                                                                    <TableCell>{order._id.substring(20, 24)}</TableCell>
                                                                    <TableCell>{order.user.username}</TableCell>
                                                                    <TableCell>{order.createdAt.substring(0, 10)}</TableCell>
                                                                    <TableCell>${order.totalPrice}</TableCell>
                                                                    <TableCell>{order.isPaid ? 'Payer le ' + order.paidAt.substring(0, 10) : 'Non'}</TableCell>
                                                                    <TableCell>{order.isDelivered ? 'Délivrer le ' + order.deliveredAt.substring(0, 10) : 'Non'}</TableCell>
                                                                    <TableCell>
                                                                        <NextLink passHref href={`/orders/${order._id}`}>
                                                                            <Button variant="contained">Detail</Button>
                                                                        </NextLink>
                                                                    </TableCell>
                                                                </TableRow>
                                                            })
                                                        }
                                                    </TableBody>
                                                </TableContainer>
                                            </ListItem>
                                        )
                            }
                        </List>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>

    )
}