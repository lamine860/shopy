import NextLink from 'next/link'
import { Store } from "../lib/store"
import { useSnackbar } from 'notistack'
import { useRouter } from "next/router"
import { registerUser } from '../lib/user'
import { useContext, useEffect } from "react"
import { useForm, Controller } from 'react-hook-form'
import { Button, Link, List, ListItem, TextField, Typography, Box } from "@mui/material"
export default function Register(props) {
    const router = useRouter()
    const { redirect } = router.query
    const { state, dispatch } = useContext(Store)
    const { user } = state
    const { handleSubmit, control, formState: { errors } } = useForm()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const submitHandler = async ({ username, email, password, password_confirm }) => {
        closeSnackbar()
        if (password !== password_confirm) {
            enqueueSnackbar("Les mots de passe ne corespont pas", { variant: 'error' });
            return;
          }
        await registerUser({ email, password, username })(dispatch, (err, message) => {
            err && enqueueSnackbar(message, { variant: 'error' })
        })
    }
    console.log(user)
    useEffect(() => {
        user && router.push('/')

    }, [user])
    return (
        <Box sx={{
            width: '80%',
            margin: '0 auto'
        }}>
            <Typography variant="h1">Inscription</Typography>
            <form onSubmit={handleSubmit(submitHandler)}>
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
                        <Button variant="contained" type="submit" fullWidth >Se connécter</Button>
                    </ListItem>
                    <ListItem>
                        Vous avez déjà un compte ? &nbsp;
                        <NextLink href={`/login?redirect=${redirect || '/'}`} passHref>
                            <Link>Se connécter</Link>
                        </NextLink>
                    </ListItem>
                </List>
            </form>
        </Box>
    )
}

