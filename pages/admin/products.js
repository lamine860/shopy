import NextLink from 'next/link'
import { useReducer, useContext, useEffect } from "react";
import { Button, Card, CardContent, CircularProgress, Grid, List, ListItem, ListItemText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { redirectIfNotIsAdminUser } from '../../lib/admin';
import { Store } from '../../lib/store';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { createAdminProduct, deleteAdminProduct, fetchProductsAdmin, productReducer } from '../../lib/product';
export default function () {
    const { state } = useContext(Store)
    const [{ loading, error, products, createLoading, createError, deleteLoading }, dispatch] = useReducer(productReducer, { loading: true, error: '', products: [] })
    const router = useRouter()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const createHandler = () => {
        createAdminProduct(state, dispatch, router)
    }
    const deleteHandler = (productId) => {
        if (!window.confirm('Êtes-vous sûr?')) return
        deleteAdminProduct(productId, state, dispatch)((err, success) => {
            closeSnackbar()
            if (err) {
                enqueueSnackbar(err, { variant: 'error' })
            } else {
                enqueueSnackbar(success, { variant: 'success' })
            }
        })
    }
    useEffect(() => {
        redirectIfNotIsAdminUser(router, state)
        fetchProductsAdmin(state.user, dispatch)
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
                            <ListItem button component="a">
                                <ListItemText >Commandes</ListItemText>
                            </ListItem>
                        </NextLink>
                        <NextLink passHref href="/admin/products">
                            <ListItem button selected component="a">
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
                                <Grid container alignItems="center">
                                    <Grid item xs={6}>
                                        <Typography variant="h1">Commandes</Typography>
                                    </Grid>
                                    <Grid item xs={6} align="right">

                                        {
                                            createLoading ?
                                                (<CircularProgress />)
                                                :
                                                (<Button onClick={createHandler} color="info" variant="contained">Ajouter</Button>)
                                        }
                                    </Grid>
                                </Grid>
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
                                                                <TableCell>NOM</TableCell>
                                                                <TableCell>PRIX</TableCell>
                                                                <TableCell>CATEGORY</TableCell>
                                                                <TableCell>NOMBRE</TableCell>
                                                                <TableCell>NOTE</TableCell>
                                                                <TableCell>ACTIONS</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {
                                                                products.map(product => {
                                                                    return <TableRow key={product._id} >
                                                                        <TableCell>{product._id.substring(20, 24)}</TableCell>
                                                                        <TableCell>{product.name}</TableCell>
                                                                        <TableCell>${product.price}</TableCell>
                                                                        <TableCell>{product.category}</TableCell>
                                                                        <TableCell>{product.countInStock}</TableCell>
                                                                        <TableCell>{product.rating}</TableCell>
                                                                        <TableCell>
                                                                            <NextLink passHref href={`/admin/products/${product._id}`}>
                                                                                <Button size="small" variant="contained">Modifier</Button>
                                                                            </NextLink>
                                                                            {' '}
                                                                            {
                                                                                deleteLoading ?
                                                                                    <CircularProgress /> :
                                                                                    <Button onClick={() => deleteHandler(product._id)} size="small" variant="contained" color="warning">supprimer</Button>
                                                                            }

                                                                        </TableCell>
                                                                    </TableRow>
                                                                })
                                                            }
                                                        </TableBody>
                                                    </Table>

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