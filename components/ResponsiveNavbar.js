import NextLink from 'next/link'
import { useContext } from 'react';
import { Store } from '../lib/store';
import { useState, useEffect } from 'react';
import { switchDarkMode } from '../lib/utils';
import classes from '../styles/styles.module.css'
import { AppBar, Container, Link, Toolbar, Typography, Box, Menu, MenuItem, Badge, Switch, Button } from "@mui/material";
import BasicUserMenu from './BasicUserMenu';


export default function ResponsiveNavbar() {
    const [cartItems, setCartItems] = useState([])
    const [user, setUser] = useState()
    const { state, dispatch } = useContext(Store)
    const [dark, setDark] = useState(false)
    const handleDarkMode = () => {
        switchDarkMode(dark)(dispatch)
        setDark(!dark)
    }
    const loginClickHandler = () => {

    }
    useEffect(() => {
        setCartItems(state.cart.cartItems)
        setDark(state.darkMode)
        setUser(state.user)
    }, [state, dark, user])
    return (
        <AppBar position="static" className={classes.navbar}>
            <Container maxWidth="lg">
                <Toolbar disableGutters={true}>
                    <NextLink href="/" passHref>
                        <Link>
                            <Typography component="div" variant="h6" sx={{ mr: 2 }}>Shopy</Typography>
                        </Link>
                    </NextLink>
                    <Box sx={{ display: { xs: 'none', md: 'flex', justifyContent: 'flex-end', width: '100%' } }}>
                        <Switch onChange={handleDarkMode} checked={dark} sx={{ mr: 1 }} color="warning">

                        </Switch>
                        <NextLink href="/cart" passHref>
                            <Link>
                                <Typography component="span" sx={{ mr: 2 }} >
                                    {cartItems.length > 0 ? (<Badge color="warning" badgeContent={cartItems.length}>Panier</Badge>)
                                        : 'Panier'}
                                </Typography>
                            </Link>
                        </NextLink>
                        {
                            user ? (<>
                                <BasicUserMenu user={user} dispatch={dispatch}/>
                            </>) : (
                                <NextLink href="/login" passHref>
                                    <Link><Typography component="span" sx={{ mr: 0 }} >Connéxion</Typography></Link>
                                </NextLink>
                            )
                        }
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )
}