import nc from 'next-connect'
import { onError } from '../../../lib/errors'
import { isAdmin, isAuth } from '../../../lib/auth'
import multer from 'multer'
import path from 'path'

const handler = nc({
    onError: onError
})
const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'public/images/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage })
handler.use(isAuth, isAdmin, upload.single('file'))

handler.post(async (req, res) => {
    const secureUrl = `/images/${req.file.filename}`
    res.send({ secureUrl })
})

export const config = {
    api: {
        bodyParser: false,
    },
}


export default handler

