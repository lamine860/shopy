import db from "../../lib/db"
import Image from 'next/image'
import NextLink from 'next/link'
import { useContext } from 'react';
import { Store } from '../../lib/store'
import Product from '../../models/product'
import styles from '../../styles/styles.module.css'
import { Typography, Link, Grid, List, ListItem, Rating, Card, Button } from "@mui/material"
import { useRouter } from "next/router";
import { addToCart } from "../../lib/product";

export default function ProductDetail({ product }) {
    const { state, dispatch } = useContext(Store)
    const router = useRouter()
    return (
        <>
            <div className={styles.my2}>
                <NextLink href="/" passHref>
                    <Link>
                        Rétourner l'accueil
                    </Link>
                </NextLink>
            </div>
            <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                    <Image src={product.image} alt={product.name} width={640} height={640} layout="responsive" />
                </Grid>
                <Grid item md={3} xs={12}>
                    <List>
                        <ListItem>
                            <Typography variant="h4" component="h1">{product.name}</Typography>
                        </ListItem>
                        <ListItem>
                            <Typography>{product.category}</Typography>
                        </ListItem>
                        <ListItem>
                            <Typography>{product.brand}</Typography>
                        </ListItem>
                        <ListItem>
                            <Rating value={product.rating} readOnly size="small" />
                            <Link href="#raiting">
                                <Typography>({product.numReviews} Commentaires)</Typography>
                            </Link>
                        </ListItem>
                        <ListItem>
                            <Typography>{product.description}</Typography>
                        </ListItem>
                    </List>
                </Grid>
                <Grid item md={3} xs={12}>
                    <Card>
                        <List>
                            <ListItem>
                                <Grid container>
                                    <Grid item xs={6}><Typography>Prix:</Typography></Grid>
                                    <Grid item xs={6}><Typography>${product.price}</Typography></Grid>
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <Grid container>
                                    <Grid item xs={6}><Typography>Satatus:</Typography></Grid>
                                    <Grid item xs={6}><Typography>{product.countInStock > 0 ? 'Disponible' : 'Non dispoible'}</Typography></Grid>
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <Button onClick={() => addToCart(product)(dispatch, state.cart, router)} fullWidth variant="contained">Ajouter au panier</Button>
                            </ListItem>
                        </List>
                    </Card>
                </Grid>
            </Grid>
        </>

    )
}

export async function getServerSideProps(context) {
    const { params } = context
    await db.connect()
    const product = await Product.findOne({ slug: params.slug })
    await db.disconnect()
    return {
        props: {
            product: db.convertDocToObject(product)
        }
    }
}
