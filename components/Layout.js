import React, { useContext, useEffect, useState } from 'react'
import Head from 'next/head'
import NextLink from 'next/link'
import { Store } from '../lib/store'
import { getTotalItem } from '../lib/product'
import styles from '../styles/styles.module.css'
import { Container, AppBar, Toolbar, Typography, CssBaseline, Box, Badge, createTheme, ThemeProvider, Switch, Link, Button } from '@mui/material'

function Layout({ title, desciption, children }) {
    const [totalItem, setTotalItem] = useState(0)
    const [user, setUser] = useState(null)
    const { state, dispatch } = useContext(Store)
    const { cartItems } = state.cart
    const { darkMode } = state
    const theme = createTheme({
        typography: {
            h1: {
                fontSize: '2rem',
                fontWeight: '400',
                margin: '1rem 0'
            },
            h2: {
                fontSize: '1.6rem',
                fontWeight: '400',
                margin: '1rem 0'
            }

        },
        palette: {
            primary: {
                main: '#208070',
            },
            mode: darkMode ? 'dark' : 'light'
        }
    })
    useEffect(() => {
        setTotalItem(getTotalItem(cartItems))
        setUser(state.user)
    }, [cartItems, state])
    return (
        <ThemeProvider theme={theme}>
            <Head>
                {desciption && <meta name="description" content={description} />}
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                />
                <title>
                    {title ? `Shopy-${title}` : 'Shopy'}
                </title>

            </Head>
            <CssBaseline />
            <AppBar position="static" className={styles.navbar}>
                <Container>
                    <Toolbar >
                        <NextLink href="/" passHref>
                            <a>
                                <Typography variant="h5">Shopy</Typography>

                            </a>
                        </NextLink>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexGrow: 1, alignContent: 'center'  }}>
                            <Switch color="info" checked={darkMode} onChange={() => dispatch({ 'type': darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' })}>
                            </Switch>
                            <NextLink href="/cart" passHref>
                                <a>
                                    {
                                        totalItem > 0 ? (<Badge anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }} badgeContent={totalItem} color="secondary">
                                            Panier
                                        </Badge>)
                                            :
                                            'Panier'
                                    }
                                </a>
                            </NextLink>
                            {
                                user ? (<>
                                    <Link sx={{color: '#f2f2f2', cursor: 'pointer'}} className={styles.ml2}
                                        aria-controls="simple-menu"
                                        aria-haspopup="true"
                                    >
                                    {user.username}
                                    </Link>
                                </>) : (
                                    <NextLink href="/login" passHref>
                                        <a className={styles.ml2}>
                                            <Typography variant="span">Connéxion</Typography>

                                        </a>
                                    </NextLink>
                                )
                            }
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar >
            <Container>
                {children}
            </Container>
            <footer className={styles.footer}>
                <Typography>&copy; Copyright - 2022-2022 Tous droits reservés</Typography>
            </footer>
        </ThemeProvider >
    )
}

export default Layout
