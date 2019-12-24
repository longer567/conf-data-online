const MongoClient = require('mongodb').MongoClient
const config = require('config')
const API = require('./api')

const {
    url,
    dbName
} = config.get("dataBase")

const db = async () => {
    const client = await MongoClient.connect(url, {
        useUnifiedTopology: true
    })
    return client.db(dbName)
}

/**
 * 
 * @param {string} documents Operated documentName in dataBase
 * @returns {object} MongoClient collection
 */
const collection = async (documents) => {
    try {
        const client = await MongoClient.connect(url, {
            useUnifiedTopology: true
        })
        const db = client.db(dbName)
        const coll = db.collection(documents)

        return coll
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {
    db,
    collection,
    API
}