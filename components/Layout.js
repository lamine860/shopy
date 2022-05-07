import Head from 'next/head'
import { Store } from '../lib/store'
import styles from '../styles/styles.module.css'
import ResponsiveAppBar from './ResponsiveNavbar'
import React, { useContext, useEffect, useState } from 'react'
import { CssBaseline, createTheme, ThemeProvider, Container, Typography } from '@mui/material'

function Layout({ title, desciption, children }) {
    const { state, dispatch } = useContext(Store)
    const [darkMode, setDarkMode] = useState(false)
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
            },
        },
        palette: {
            primary: {
                main: '#208070',
            },
            secondary: {
                main: '#208080',
              },
            mode: darkMode ? 'dark' : 'light',
            
        }
    })
    useEffect(()=> {
        setDarkMode(state.darkMode)

    }, [state.darkMode])
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
            <ResponsiveAppBar />
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
