import NextLink from 'next/link'
import { Store } from "../lib/store"
import { useSnackbar } from 'notistack'
import { useRouter } from "next/router"
import { useContext, useEffect } from "react"
import { useForm, Controller } from 'react-hook-form'
import { Button, Link, List, ListItem, TextField, Typography, Box } from "@mui/material"
import { loginUser } from '../lib/user'
export default function Login(props) {
    const router = useRouter()
    const { redirect } = router.query
    const { state, dispatch } = useContext(Store)
    const { user } = state
    const { handleSubmit, control, formState: { errors } } = useForm()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const submitHandler = async ({ email, password }) => {
        closeSnackbar()
        await loginUser({ email, password })(dispatch, (err, message) => {
            err && enqueueSnackbar(message, { variant: 'error' })
        })
    }
    useEffect(() => {
        user && router.push('/')

    }, [user])
    return (
        <Box sx={{
            width: '80%',
            margin: '0 auto'
        }}>
            <Typography variant="h1">Connexion</Typography>
            <form onSubmit={handleSubmit(submitHandler)}>
                <List>
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
                                                'Le champs mot de passe doit contenir au moins 6 caractère' :
                                                'Le champs mot de passe est obligatoire'
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
                        Vous n&apos;avez toujours pas un compte ? &nbsp;
                        <NextLink href={`/register?redirect=${redirect || '/'}`} passHref>
                            <Link>Créer un compte</Link>
                        </NextLink>
                    </ListItem>
                </List>
            </form>
        </Box>
    )
}

