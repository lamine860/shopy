import { handleBreakpoints } from "@mui/system";
import db from "../../../lib/db";
import Product from "../../../models/product";

export default async function handler(req, res) {
    await db.connect()
    const product = await Product.findById(req.query.id)
    db.disconnect()
    return res.json(product)
}