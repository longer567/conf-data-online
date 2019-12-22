const uuidV4 = require('uuid/v4')
const express = require('express')
const routerRequest = express.Router()
const {
    collection,
    API
} = require('../../dataBase')

routerRequest.get('/find', async (req, res) => {
    API.findLineDocument(await collection('documents'), {
        "a": "ddd"
    }, (result) => {
        res.send(result)
    })
})

routerRequest.post('/addItem', async (req, res) => {
    const {
        itemName,
        itemContent
    } = req.body
    API.insertOneDocument(await collection('documents'), {
        "hash": uuidV4.split('-').slicee(0, 3),
        itemName,
        itemContent
    }, (result => {
        res.send(result)
    }))
})

module.exports = { routerRequest }