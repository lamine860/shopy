import mongoose from 'mongoose'

const connection = {}

export async function connect() {
    if (connection.isConnected) {
        console.log('Already connected')
        return
    }
    if (mongoose.connections.length > 0) {
        connection.isConnected = mongoose.connections[0].readyState
        if (connection.isConnected === 1) {
            console.log('Use previous connection')
            return
        }
        mongoose.disconnect()
    }
    const db = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    console.log('New connection')
    connection.isConnected = db.connections[0].readyState

}

export async function disconnect() {
    if (connection.isConnected) {
        if (process.env.NODE_ENV === 'production') {
            await mongoose.disconnect()
            connection.isConnected = false
        } else {
            console.log('Not disconnected')
        }
    }
}

function convertDocToObject(doc) {
    const { _doc } = doc
    return { ..._doc, _id: _doc._id.toString(), createdAt: _doc.createdAt.toString(), updatedAt: _doc.updatedAt.toString() };
}

const db = { connect, disconnect, convertDocToObject }

export default db