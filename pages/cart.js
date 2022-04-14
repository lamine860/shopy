import Image from "next/image"
import NextLink from 'next/link'
import { useContext } from "react"
import dinamic from 'next/dynamic'
import { Store } from "../lib/store"
import { useRouter } from 'next/router'
import { addToCart, getTotalItem, getTotalPrice, removeFromCart } from "../lib/product"
import { Typography, Link, Grid, Table, TableContainer, TableHead, TableCell, TableBody, TableRow, Button, Select, MenuItem, List, ListItem, Card } from "@mui/material"
function Cart(props) {
    const { state, dispatch } = useContext(Store)
    const { cart } = state
    const { cartItems } = cart
    const router = useRouter()
    const handleQuantity = (item, quantity) => {
        addToCart(item, quantity)(dispatch, cart)
    }
    const removeItem = (item) => {
        removeFromCart(item)(dispatch)
    }
    return (
        <>
            <Typography variant="h2" mt={2}>le panier</Typography>
            {
                cartItems.length === 0 ?
                    (
                        <div>
                            Le panier est vide! {' '} <NextLink href="/" passHref><Link>Aller a l'accueil</Link></NextLink>
                        </div>
                    )
                    : (
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={9}>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Image</TableCell>
                                                <TableCell>Nom</TableCell>
                                                <TableCell align="right">Quantité</TableCell>
                                                <TableCell align="right">Prix</TableCell>
                                                <TableCell align="right">Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                cartItems.map(item => {
                                                    return <TableRow key={item._id}>
                                                        <TableCell>
                                                            <NextLink href={`/product/${item.slug}`} passHref>
                                                                <Link><Image src={item.image} alt={item.name} width={70} height={70} /></Link>
                                                            </NextLink>
                                                        </TableCell>
                                                        <TableCell>
                                                            <NextLink href={`/product/${item.slug}`} passHref>
                                                                <Link><Typography>{item.name}</Typography></Link>
                                                            </NextLink>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Select value={item.quantity} onChange={(e) => handleQuantity(item, e.target.value)}>
                                                                {
                                                                    [...Array(item.countInStock).keys()].map(key => {
                                                                        return <MenuItem key={key + 1} value={key + 1}>{key + 1}</MenuItem>
                                                                    })
                                                                }

                                                            </Select>
                                                        </TableCell>
                                                        <TableCell align="right"><Typography variant="h6">${item.price}</Typography></TableCell>
                                                        <TableCell align="right">
                                                            <Button onClick={() => removeItem(item)} color="secondary" variant="contained" size="small">supprimer</Button>
                                                        </TableCell>
                                                    </TableRow>
                                                })
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Card>
                                    <List>
                                        <ListItem>
                                            <Typography variant="h6">
                                                Total {getTotalItem(cartItems)} {' '} Produit(s):
                                                ${getTotalPrice(cartItems)}
                                            </Typography>
                                        </ListItem>
                                        <ListItem>
                                            <Button variant="contained" onClick={() => router.push('/shipping')} fullWidth>Passer à la casse</Button>
                                        </ListItem>
                                    </List>
                                </Card>
                            </Grid>
                        </Grid>
                    )

            }
        </>
    )

}

export default dinamic(Promise.resolve(Cart), { ssr: false })