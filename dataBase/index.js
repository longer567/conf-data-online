const MongoClient = require('mongodb').MongoClient
const config = require('config')
const API = require('./api')

const {
    url,
    dbName
} = config.get("dataBase")

/**
 * 
 * @param {string} documents Operated documentName in dataBase
 * @returns {object} MongoClient collection
 */
const collection = async (documents) => {
    const client = await MongoClient.connect(url, {
        useUnifiedTopology: true
    })
    console.log('mongo connect success!')
    const db = client.db(dbName)
    const collection = db.collection(documents)

    return collection
}

module.exports = { collection, API }