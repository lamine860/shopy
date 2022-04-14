import '../styles/globals.css'
import Layout from "../components/Layout"
import { StoreProvider } from '../lib/store'
import { SnackbarProvider } from 'notistack'

function MyApp({ Component, pageProps }) {
  return (
    <SnackbarProvider anchorOrigin={{ 'vertical': 'top', 'horizontal': 'center' }}>
      <StoreProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </StoreProvider>
    </SnackbarProvider>

  )
}

export default MyApp
