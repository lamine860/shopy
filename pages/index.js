import { useContext } from 'react'
import { useRouter } from 'next/router'
import db from '../lib/db'
import Product from '../models/product'
import { Alert, Grid, Typography } from '@mui/material'
import styles from '../styles/styles.module.css'
import ProductItem from '../components/ProductItem'
import { Store } from '../lib/store'
import { addToCart } from '../lib/product'

export default function Home({ products }) {
  const { state, dispatch } = useContext(Store)
  const router = useRouter()
  return (
    <>
      <Typography variant="h4" className={styles.title}>
        Les produits populaires
      </Typography>
      <Grid container spacing={3}>
        {
          products.map(product => {
            return <Grid key={product._id} item md={4}>
              <ProductItem product={product} addToCartHandler={() => addToCart(product)(dispatch, state.cart, router)} />
            </Grid>
          })
        }
      </Grid>
    </>
  )
}

export async function getServerSideProps() {
  await db.connect()
  const products = await await Product.find({})
  await db.disconnect()
  return {
    props: {
      products: products.map(db.convertDocToObject)
    }
  }
}
