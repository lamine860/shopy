import NextLink from 'next/link'
import { Store } from "../lib/store";
import { useContext, useState, useEffect } from "react";
import { Controller, useForm } from 'react-hook-form'
import { Card, CardContent, Grid, ListItem, ListItemText, List, Typography, Button, TextField } from "@mui/material";
import classes from '../styles/styles.module.css'
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack'
import { updateUser } from '../lib/user';
import { getError } from '../lib/errors';
export default function Profile() {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const router = useRouter()
    const { handleSubmit, formState: { errors }, control, setValue } = useForm()
    const { state, dispatch } = useContext(Store)
    const submitHandler = ({ username, email, password, password_confirm }) => {
        closeSnackbar()
        if (password !== password_confirm) {
            enqueueSnackbar('Les mots de passe n\'est corespondent pas', { variant: 'error' })
            return
        }
        updateUser({ username, email, password })(dispatch, state, (err) => {
            if (err) {
                enqueueSnackbar(getError(err), { variant: 'error' })

            } else {
                enqueueSnackbar('Mise à jour du profile réussie')
                setValue('password', '')
                setValue('password_confirm', '')
            }
        })

    }
    useEffect(() => {
        if (!state.user) {
            router.push('/login')
        }
        setValue('username', state.user?.username)
        setValue('email', state.user?.email)
    }, [])
    return (
        <Grid container spacing={1} mt={4}>
            <Grid item xs={12} md={3}>
                <Card>
                    <List>
                        <NextLink passHref href="/profile">
                            <ListItem button selected component="a">
                                <ListItemText >Profile d'utilisateur</ListItemText>
                            </ListItem>
                        </NextLink>
                        <NextLink passHref href="/order-history">
                            <ListItem button component="a">
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
                                <Typography variant="h5" component="div">Profile</Typography>
                            </ListItem>
                            <ListItem>
                                <form onSubmit={handleSubmit(submitHandler)} className={classes.form}  >
                                    <List>
                                        <ListItem>
                                            <Controller name="username"
                                                control={control} defaultValue=""
                                                rules={{
                                                    required: true,
                                                    minLength: 2
                                                }}
                                                render={({ field }) => {
                                                    return <TextField variant="outlined" fullWidth
                                                        id="username" label="Nom"
                                                        inputProps={{ type: 'text' }}
                                                        error={Boolean(errors.username)}
                                                        helperText={
                                                            errors.username
                                                                ? errors.email?.type === 'minLength'
                                                                    ? 'Le champs nom doit contenir au moins 2 caractère'
                                                                    : 'Le champs nom est obligatoire'
                                                                : ''
                                                        }

                                                        {...field}
                                                    >
                                                    </TextField>
                                                }}
                                            ></Controller>
                                        </ListItem>
                                        <ListItem>
                                            <Controller name="email"
                                                control={control} defaultValue=""
                                                rules={{
                                                    required: true,
                                                    pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                                                }}
                                                render={({ field }) => {
                                                    return <TextField variant="outlined" fullWidth
                                                        id="email" label="Email"
                                                        inputProps={{ type: 'email' }}
                                                        error={Boolean(errors.email)}
                                                        helperText={
                                                            errors.email
                                                                ? errors.email?.type === 'pattern'
                                                                    ? 'Le champs e-mail n\'est pas valide'
                                                                    : 'Le champs e-mail est obligatoire'
                                                                : ''
                                                        }

                                                        {...field}
                                                    >
                                                    </TextField>
                                                }}
                                            ></Controller>
                                        </ListItem>
                                        <ListItem>
                                            <Controller name="password"
                                                control={control} defaultValue=""
                                                rules={{
                                                    required: true,
                                                    minLength: 6,
                                                }}
                                                render={({ field }) => {
                                                    return <TextField variant="outlined" fullWidth
                                                        id="password" label="Mot de passe"
                                                        inputProps={{ type: 'password' }}
                                                        error={Boolean(errors.password)}
                                                        helperText={
                                                            errors.email ?
                                                                errors.password?.type == 'minLength' ?
                                                                    'Ce champs doit contenir au moins 6 caractère' :
                                                                    'Ce champs est obligatoire'
                                                                : ''
                                                        }
                                                        {...field}
                                                    >
                                                    </TextField>
                                                }}
                                            ></Controller>
                                        </ListItem>
                                        <ListItem>
                                            <Controller name="password_confirm"
                                                control={control} defaultValue=""
                                                rules={{
                                                    required: true,
                                                    minLength: 6,
                                                }}
                                                render={({ field }) => {
                                                    return <TextField variant="outlined" fullWidth
                                                        id="password_confirm" label="Confirmation du mot de passe"
                                                        inputProps={{ type: 'password' }}
                                                        error={Boolean(errors.password_confirm)}
                                                        helperText={
                                                            errors.password_confirm ?
                                                                errors.password_confirm?.type == 'minLength' ?
                                                                    'Ce champs doit contenir au moins 6 caractère' :
                                                                    'Ce champs est obligatoire'
                                                                : ''
                                                        }
                                                        {...field}
                                                    >
                                                    </TextField>
                                                }}
                                            ></Controller>
                                        </ListItem>
                                        <ListItem>
                                            <Button variant="contained" type="submit" fullWidth >Mettre à jour</Button>
                                        </ListItem>
                                    </List>
                                </form>
                            </ListItem>
                        </List>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}