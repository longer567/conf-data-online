const uuidV4 = require('uuid/v4')
const express = require('express')
const routerRequest = express.Router()
const {
    msg
} = require('../util')
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
        hash: uuidV4.split('-').slicee(0, 3),
        itemName,
        itemContent
    }, (result => {
        res.send(result)
    }))
})

routerRequest.post('/signUser', async (req, res) => {
    const {
        name,
        pass
    } = req.body
    const coll = await collection('users')
    API.findLineDocument(coll, {
        name
    }, findResult => {
        if (findResult.length) {
            res.send(msg(199, '已有同名用户'))
        } else {
            API.insertOneDocument(coll, {
                name,
                pass,
            }, insertResult => {
                API.createCollectionIndex(coll, {
                    name
                }, indexResult => {
                    res.send(msg(200, '注册成功', {
                        name: insertResult.ops[0].name
                    }))
                })
            })
        }
    })
    // API.insertOneDocument(await collection('users'), {
    //     name
    // }, result => {
    //     res.send(result)
    // })
})

module.exports = {
    routerRequest
}