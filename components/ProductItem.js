import { Box, Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Rating, Typography } from "@mui/material"
import NextLink from 'next/link'

export default function ProductItem({ product, addToCartHandler }) {
    return (
        <Card >
            <NextLink href={`/product/${product.slug}`} passHref>
                <CardActionArea>
                    <CardMedia component="img" image={product.image} alt={product.name} />
                    <CardContent>
                        <Typography>
                            {product.name}
                        </Typography>
                        <Rating value={product.rating} readOnly />
                    </CardContent>
                </CardActionArea>
            </NextLink>
            <CardActions>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '80%', margin: '0 auto', padding: "5px 0" }}>
                    <Typography>{product.price}GNF</Typography>
                    <Button color="primary" size="small" onClick={() => addToCartHandler(product)}>Ajouter au panier</Button>
                </Box>
            </CardActions>
        </Card>

    )
}