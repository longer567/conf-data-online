const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const config = require('config')

const { url, dbName } = config.get("dataBase")

MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
    assert.equal(null, err)
    console.log("Serve connect success!")

    const db = client.db(dbName)
    client.close()
})
