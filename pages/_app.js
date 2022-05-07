import '../styles/globals.css'
import Layout from "../components/Layout"
import { StoreProvider } from '../lib/store'
import { SnackbarProvider } from 'notistack'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'

function MyApp({ Component, pageProps }) {
  return (
    <SnackbarProvider anchorOrigin={{ 'vertical': 'top', 'horizontal': 'center' }}>
      <StoreProvider>
        <PayPalScriptProvider deferLoading={true}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </PayPalScriptProvider>
      </StoreProvider>
    </SnackbarProvider>

  )
}

export default MyApp
