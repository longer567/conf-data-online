const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const config = require('config')

const API = require('./api')

const {
    url,
    dbName
} = config.get("dataBase")

const db = (documents) => {
    MongoClient.connect(url, {
        useUnifiedTopology: true
    }, (err, client) => {
        assert.equal(null, err)
        console.log("Serve connect success!")
    
        const db = client.db(dbName)
        const collection = db.collection(documents);
    
        const obj = {
            'title': 'activity1',
            'data': new Date(),
            'content': {
                a: 111,
                b: 222
            }
        }
        
        API.insertOneDocument(collection, obj, (res) => {
            console.log(res)
        })

        client.close()
    })
}

db('documents')


