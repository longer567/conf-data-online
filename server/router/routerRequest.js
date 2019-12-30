const fs = require('fs')
const path = require('path')
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
const {
    checkToken
} = require('../util')
const rootPath = process.cwd()

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
                itemsHash: []
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

// routerRequest.post('/findUserAllItems', async (req, res) => {
//     const {
//         name
//     } = req.body
//     const token = req.get("Authorization")
//     if (token) {
//         jwt.verify(token, jwtKey, (err, decodeToken) => {
//             if (decodeToken === name) {
//                 res.send(msg(200, 'success'))
//             } else {
//                 // token失效（name token不符）
//                 res.send(msg(199, 'token失效'))
//             }
//         })
//     } else {
//         // 未登录
//         res.send(msg(199, '未登录'))
//     }
// })

routerRequest.post('/addItem', async (req, res) => {
    const {
        itemTitle,
        itemContent,
        ownName,
        date,
        originValue,
        itemGroups
    } = req.body
    const collDoc = await collection('documents')
    const collUse = await collection('users')
    const hash = uuidV4().split('-').slice(0, 3).join('')
    const itemName = itemTitle + '-' + hash
    const itemPath = path.resolve(rootPath, `./public/jsItems/${itemName}.js`)
    const originPath = path.resolve(rootPath, `./public/originValue/${itemName}-origin.json`)
    API.insertOneDocument(collDoc, {
        hash,
        ownName,
        itemTitle,
        itemName,
        itemPath,
        date,
        originPath,
        itemGroups
    }, (insertItemResult => {
        API.updateOneDocument(collUse, {
            name: ownName
        }, {
            $push: {
                itemsHash: hash
            }
        }, updateResult => {

            fs.writeFileSync(itemPath, `var data_${itemTitle}_${hash.slice(0, 5)} = ${itemContent}`)
            fs.writeFileSync(originPath, originValue)

            res.send(msg(200, 'success', {
                item: `${itemName}.js`,
            }))
        })
    }))
})

routerRequest.post('/findUserAllItems', async (req, res) => {
    const {
        name
    } = req.body
    const collUse = await collection('users')
    const collDoc = await collection('documents')

    API.findLineDocument(collUse, {
        name
    }, findResult => {
        const itemsHashArr = findResult[0].itemsHash.map(i => {
            return {
                hash: i
            }
        })
        API.findLineDocument(collDoc, {
            $or: itemsHashArr
        }, findItemResult => {
            console.log(findItemResult)
            res.send(msg(200, 'success', findItemResult || []))
        })
    })
})

routerRequest.post('/isLogin', async (req, res) => {
    const {
        name
    } = req.body
    checkToken(req, res, jwt, name, jwtKey, () => {
        res.send(msg(200, 'login success'))
    })
})

routerRequest.post('/editerAuth', async (req, res) => {
    const {
        name,
        hash,
        itemContent,
        originValue,
        itemTitle,
        itemGroups
    } = req.body
    const collUse = await collection('users')
    const collDoc = await collection('documents')
    checkToken(req, res, jwt, name, jwtKey, () => {
        API.findLineDocument(collDoc, {
            hash
        }, findDocResult => {
            // find delete mumbers
            const deleteMember = findDocResult[0].itemGroups.map(i => !itemGroups.includes(i))
            // update collDoc itemGroups
            API.updateOneDocument(collDoc, {
                itemGroups
            }, {
                $set: {
                    itemGroups
                }
            }, async updateDocResult => {
                // i delete name
                await deleteMember.forEach(i => {
                    API.updateOneDocument(collUse, {
                        name: i
                    }, {
                        $pull: {
                            
                        }
                    })
                })

                // xxx
            })
        })
        API.findLineDocument(collUse, {
            name
        }, findResult => {
            if (findResult[0].itemsHash.includes(hash)){
                fs.writeFileSync(path.resolve(rootPath, `./public/jsItems/${itemTitle}-${hash}.js`), `var data_${itemTitle}_${hash.slice(0, 5)} = ${itemContent}`)
                fs.writeFileSync(path.resolve(rootPath, `./public/originValue/${itemTitle}-${hash}-origin.json`), originValue)

                res.send(msg(200, '修改完成'))
            }else{
                res.send(msg(200, '修改失败,您无权限修改'))
            }
        })
    })
})

module.exports = {
    routerRequest
}