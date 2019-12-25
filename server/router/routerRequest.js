const config = require('config')
const uuidV4 = require('uuid/v4')
const express = require('express')
const jwt = require('jsonwebtoken')
const routerRequest = express.Router()
const jwtKey = config.get('jwtKey')
const {
    msg
} = require('../util')
const {
    collection,
    API
} = require('../../dataBase')

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
})

routerRequest.post('/loginUser', async (req, res) => {
    const {
        name,
        pass
    } = req.body
    const coll = await collection('users')
    API.findLineDocument(coll, {
        name,
        pass
    }, findResult => {
        if (findResult.length) {
            jwt.sign(name, jwtKey, (err, token) => {
                res.send(msg(200, '登录成功', {
                    name,
                    token
                }))
            })
        } else {
            res.send(msg(199, '请检查用户名与密码'))
        }
    })
})

routerRequest.post('/findUserAllItems', async (req, res) => {
    const {
        name
    } = req.body
    const token = req.get("Authorization")
    if (token) {
        jwt.verify(token, jwtKey, (err, decodeToken) => {
            if (decodeToken === name) {
                res.send(msg(200, 'success'))
            } else {
                // token失效（name token不符）
                res.send(msg(199, 'token失效'))
            }
        })
    } else {
        // 未登录
        res.send(msg(199, '未登录'))
    }
})

module.exports = {
    routerRequest
}