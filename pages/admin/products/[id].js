import NextLink from 'next/link'
import { useReducer, useContext, useEffect, useState } from "react";
import { Button, Card, CardContent, Checkbox, CircularProgress, FormControlLabel, Grid, List, ListItem, ListItemText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material"
import { redirectIfNotIsAdminUser } from '../../../lib/admin';
import { Store } from '../../../lib/store';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { Controller, useForm } from 'react-hook-form';
import { fetchAdminProductById, productReducer, updateAdminProductById, uploadProductFile } from '../../../lib/product';


export default function Product({ params }) {
    const router = useRouter()
    const { state } = useContext(Store)
    const [isFeatured, setIsFeatured] = useState(false);
    const [{ uploadLoading, uploadError, productLoading, productError, product, updateProductLoading }, dispatch] = useReducer(productReducer, { productLoading: true, productError: '', product: {} })
    const { handleSubmit, control, formState: { errors }, setValue } = useForm()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const uploadHandler = (e, imageField = 'image') => {
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('file', file)
        uploadProductFile(formData, state, dispatch, (err, file) => {
            if (err) {
                enqueueSnackbar(err, { variant: 'error' })
            } else {
                setValue(imageField, file.secureUrl)
            }
        })

    }
    const submitHandler = ({
        name,
        slug,
        price,
        category,
        image,
        featuredImage,
        brand,
        countInStock,
        description, }) => {
        updateAdminProductById(params.id, {
            name,
            slug,
            price,
            category,
            image,
            featuredImage,
            brand,
            countInStock,
            description,
        }, state, dispatch, (err) => {
            closeSnackbar()
            if (err) {

                enqueueSnackbar(err, { variant: 'error' })
            } else {
                enqueueSnackbar('Produit mis à jour avec succès', { variant: 'success' })
            }

        })
    }
    useEffect(() => {
        redirectIfNotIsAdminUser(router, state)
        fetchAdminProductById(params.id, state, dispatch, (data) => {
            setValue('name', data.name);
            setValue('slug', data.slug);
            setValue('price', data.price);
            setValue('image', data.image);
            setValue('featuredImage', data.featuredImage);
            setIsFeatured(data.isFeatured);
            setValue('category', data.category);
            setValue('brand', data.brand);
            setValue('countInStock', data.countInStock);
            setValue('description', data.description);
        })

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
                        <form onSubmit={handleSubmit(submitHandler)}>
                            <List>
                                <ListItem>
                                    {
                                        productLoading && <CircularProgress />
                                    }
                                    {
                                        productError && <Typography>{productError}</Typography>
                                    }
                                </ListItem>
                                <ListItem>
                                    <Typography variant="h1">Modification {params.id}</Typography>
                                </ListItem>
                                <ListItem>
                                    <Controller name="name"
                                        control={control} defaultValue=""
                                        rules={{
                                            required: true,
                                        }}
                                        render={({ field }) => {
                                            return <TextField variant="outlined" fullWidth
                                                id="name" label="Nom"
                                                inputProps={{ type: 'text' }}
                                                error={Boolean(errors.name)}
                                                helperText={
                                                    errors.name
                                                        ? 'Le champs nom est obligatoire' : ''
                                                }

                                                {...field}
                                            >
                                            </TextField>
                                        }}
                                    ></Controller>
                                </ListItem>
                                <ListItem>
                                    <Controller name="slug"
                                        control={control} defaultValue=""
                                        rules={{
                                            required: true,
                                        }}
                                        render={({ field }) => {
                                            return <TextField variant="outlined" fullWidth
                                                id="slug" label="Slug"
                                                inputProps={{ type: 'text' }}
                                                error={Boolean(errors.slug)}
                                                helperText={
                                                    errors.slug
                                                        ? 'Le champs slug est obligatoire' : ''
                                                }

                                                {...field}
                                            >
                                            </TextField>
                                        }}
                                    ></Controller>
                                </ListItem>
                                <ListItem>
                                    <Controller name="price"
                                        control={control} defaultValue=""
                                        rules={{
                                            required: true,
                                        }}
                                        render={({ field }) => {
                                            return <TextField variant="outlined" fullWidth
                                                id="price" label="Prix"
                                                inputProps={{ type: 'number' }}
                                                error={Boolean(errors.price)}
                                                helperText={
                                                    errors.price
                                                        ? 'Le champs prix est obligatoire' : ''
                                                }

                                                {...field}
                                            >
                                            </TextField>
                                        }}
                                    ></Controller>
                                </ListItem>
                                <ListItem>
                                    <Controller name="image"
                                        control={control} defaultValue=""
                                        rules={{
                                            required: true,
                                        }}
                                        render={({ field }) => {
                                            return <TextField variant="outlined" fullWidth
                                                id="image" label="Image"
                                                inputProps={{ type: 'text' }}
                                                error={Boolean(errors.image)}
                                                helperText={
                                                    errors.image
                                                        ? 'Le champs image est obligatoire' : ''
                                                }

                                                {...field}
                                            >
                                            </TextField>
                                        }}
                                    ></Controller>
                                </ListItem>
                                <ListItem>
                                    <Button variant="contained" component="label">Téléverser un fichier
                                        <input type="file" onChange={uploadHandler} hidden />
                                    </Button>
                                    {uploadLoading && <CircularProgress />}
                                </ListItem>
                                <ListItem>
                                    <FormControlLabel
                                        label="Is Featured"
                                        control={
                                            <Checkbox
                                                onClick={(e) => setIsFeatured(e.target.checked)}
                                                checked={product.isFeatured}
                                                name="isFeatured"
                                            />
                                        }
                                    ></FormControlLabel>
                                </ListItem>
                                <ListItem>
                                    <Controller
                                        name="featuredImage"
                                        control={control}
                                        defaultValue=""
                                        rules={{
                                            required: true,
                                        }}
                                        render={({ field }) => (
                                            <TextField
                                                variant="outlined"
                                                fullWidth
                                                id="featuredImage"
                                                label="Image à la une"
                                                error={Boolean(errors.image)}
                                                helperText={
                                                    errors.image ? 'Image à la une est requis' : ''
                                                }
                                                {...field}
                                            ></TextField>
                                        )}
                                    ></Controller>
                                </ListItem>
                                <ListItem>
                                    <Button variant="contained" component="label">
                                        Téléverser un fichier
                                        <input
                                            type="file"
                                            onChange={(e) => uploadHandler(e, 'featuredImage')}
                                            hidden
                                        />
                                    </Button>
                                    {uploadLoading && <CircularProgress />}
                                </ListItem>
                                <ListItem>
                                    <Controller
                                        name="category"
                                        control={control}
                                        defaultValue=""
                                        rules={{
                                            required: true,
                                        }}
                                        render={({ field }) => (
                                            <TextField
                                                variant="outlined"
                                                fullWidth
                                                id="category"
                                                label="Category"
                                                error={Boolean(errors.category)}
                                                helperText={
                                                    errors.category ? 'Category est requis' : ''
                                                }
                                                {...field}
                                            ></TextField>
                                        )}
                                    ></Controller>
                                </ListItem>
                                <ListItem>
                                    <Controller
                                        name="brand"
                                        control={control}
                                        defaultValue=""
                                        rules={{
                                            required: true,
                                        }}
                                        render={({ field }) => (
                                            <TextField
                                                variant="outlined"
                                                fullWidth
                                                id="brand"
                                                label="Marque"
                                                error={Boolean(errors.brand)}
                                                helperText={errors.brand ? 'Marque est requis' : ''}
                                                {...field}
                                            ></TextField>
                                        )}
                                    ></Controller>
                                </ListItem>
                                <ListItem>
                                    <Controller
                                        name="countInStock"
                                        control={control}
                                        defaultValue=""
                                        rules={{
                                            required: true,
                                        }}
                                        render={({ field }) => (
                                            <TextField
                                                variant="outlined"
                                                fullWidth
                                                id="countInStock"
                                                label="Numbre en stock"
                                                error={Boolean(errors.countInStock)}
                                                helperText={
                                                    errors.countInStock
                                                        ? 'Numbre en stock ers requis'
                                                        : ''
                                                }
                                                {...field}
                                            ></TextField>
                                        )}
                                    ></Controller>
                                </ListItem>
                                <ListItem>
                                    <Controller
                                        name="description"
                                        control={control}
                                        defaultValue=""
                                        rules={{
                                            required: true,
                                        }}
                                        render={({ field }) => (
                                            <TextField
                                                variant="outlined"
                                                fullWidth
                                                multiline
                                                id="description"
                                                label="Description"
                                                error={Boolean(errors.description)}
                                                helperText={
                                                    errors.description
                                                        ? 'Description est requis'
                                                        : ''
                                                }
                                                {...field}
                                            ></TextField>
                                        )}
                                    ></Controller>
                                </ListItem>
                                <ListItem>
                                    <Button
                                        variant="contained"
                                        type="submit"
                                        fullWidth
                                        color="primary"
                                    >
                                        Mettre à jour
                                    </Button>
                                    {updateProductLoading && <CircularProgress />}
                                </ListItem>
                            </List>
                        </form>
                    </CardContent>
                </Card>
            </Grid>
        </Grid >
    )
}


export function getServerSideProps({ params }) {
    return {
        props: {
            params: params
        }
    }
}
