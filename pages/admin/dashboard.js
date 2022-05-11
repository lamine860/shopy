import NextLink from 'next/link'
import { useReducer, useContext, useEffect } from "react";
import { fetchAdminDasbordSummary, redirectIfNotIsAdminUser, summaryReducer } from "../../lib/admin";
import { Button, Card, CardActions, CardContent, CircularProgress, Grid, List, ListItem, ListItemText, Typography } from "@mui/material"
import { Store } from '../../lib/store'
import Chart from 'chart.js/auto';
import { Bar} from 'react-chartjs-2'
import { useRouter } from 'next/router';



export default function () {
    const { state } = useContext(Store)
    const [{ loading, error, summary }, dispatch] = useReducer(summaryReducer, { loading: true, error: '', summary: [] })
    const router = useRouter()
    useEffect(() => {
        redirectIfNotIsAdminUser(router, state)
        fetchAdminDasbordSummary(state)(dispatch)
    }, [])
    return (
        <Grid container spacing={1} mt={4}>
            <Grid item xs={12} md={3}>
                <Card>
                    <List>
                        <NextLink passHref href="/admin/dashboard">
                            <ListItem button selected component="a">
                                <ListItemText>Adminstration</ListItemText>
                            </ListItem>
                        </NextLink>
                        <NextLink passHref href="/admin/orders">
                            <ListItem button component="a">
                                <ListItemText >Commandes</ListItemText>
                            </ListItem>
                        </NextLink>
                        <NextLink passHref href="/admin/products">
                            <ListItem button component="a">
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
                        <List>
                            <ListItem>
                                {
                                    loading ? (
                                        <CircularProgress />
                                    ) :
                                        error ? (
                                            <Typography>{error}</Typography>
                                        ) :
                                            (
                                                <Grid container spacing={4}>
                                                    <Grid item xs={12} md={3}>
                                                        <Card raised>
                                                            <CardContent>
                                                                <Typography variant="h1">${summary.ordersPrice}</Typography>
                                                                <Typography>Ventes</Typography>
                                                            </CardContent>
                                                            <CardActions>
                                                                <NextLink passHref href="/admin/orders">
                                                                    <Button size="small" color="primary">Voire</Button>
                                                                </NextLink>
                                                            </CardActions>
                                                        </Card>
                                                    </Grid>
                                                    <Grid item xs={12} md={3}>
                                                        <Card raised>
                                                            <CardContent>
                                                                <Typography variant="h1">{summary.ordersCount}</Typography>
                                                                <Typography>Commandes</Typography>
                                                            </CardContent>
                                                            <CardActions>
                                                                <NextLink passHref href="/admin/orders">
                                                                    <Button size="small" color="primary">Voire</Button>
                                                                </NextLink>
                                                            </CardActions>
                                                        </Card>
                                                    </Grid>
                                                    <Grid item xs={12} md={3}>
                                                        <Card raised>
                                                            <CardContent>
                                                                <Typography variant="h1">{summary.productsCount}</Typography>
                                                                <Typography>Produits</Typography>
                                                            </CardContent>
                                                            <CardActions>
                                                                <NextLink passHref href="/admin/products">
                                                                    <Button size="small" color="primary">Voire</Button>
                                                                </NextLink>
                                                            </CardActions>
                                                        </Card>
                                                    </Grid>
                                                    <Grid item xs={12} md={3}>
                                                        <Card raised>
                                                            <CardContent>
                                                                <Typography variant="h1">{summary.usersCount}</Typography>
                                                                <Typography>Utilisateurs</Typography>
                                                            </CardContent>
                                                            <CardActions>
                                                                <NextLink passHref href="/admin/users">
                                                                    <Button size="small" color="primary">Voire</Button>
                                                                </NextLink>
                                                            </CardActions>
                                                        </Card>
                                                    </Grid>
                                                </Grid>
                                            )
                                }
                            </ListItem>
                            <ListItem>
                                <Typography variant="h1" component="h1">Graphique des ventes</Typography>
                            </ListItem>
                            <ListItem>
                                <Bar data={{
                                    labels: summary.salesData?.map((x) => x._id),
                                    datasets: [
                                        {
                                            label: 'Ventes',
                                            backgroundColor: 'rgba(222, 122, 208, 1)',
                                            data: summary.salesData?.map((x) => x.totalSales),
                                        },
                                    ],
                                }}
                                    options={{
                                        legend: { display: true, position: 'right' },
                                    }} />
                            </ListItem>
                        </List>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}