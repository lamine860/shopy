import nc from 'next-connect'
import { isAuth } from '../../../lib/auth'
import { onError } from '../../../lib/errors'

const handler = nc({
    onError: onError
})

handler.use(isAuth)
handler.get(async (req, res) => {
    res.send(process.env.PAYPAL_CLIENT_ID || 'sb')
})

export default handler