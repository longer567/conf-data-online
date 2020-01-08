const fs = require('fs')
const path = require('path')
const config = require('config')
const express = require('express')
const jwt = require('jsonwebtoken')
const jwtKey = config.get('jwtKey')
const routerRequest = express.Router()
const {
    msg,
    hashOutput
} = require('../util')
const {
    collection,
    API
} = require('../../dataBase')
const {
    checkToken
} = require('../util')
const rootPath = process.cwd()

module.exports = (io) => {
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
        console.log(req)
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

    routerRequest.post('/test', async (req, res) => {
        const {
            itemGroups
        } = req.body
        const collUse = await collection('users')
        const collDoc = await collection('documents')

        API.findLineDocument(collUse, {
                name: {
                    $in: itemGroups
                }
            },
            findItemMemberResult => {
                if (!findItemMemberResult || findItemMemberResult.length < itemGroups.length) {
                    // some other not exist!
                    res.send(msg(199, '部分用户未存在'))
                } else {

                }
            }
        )

    })

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
        const itemName = itemTitle + '-' + hash
        const itemPath = path.resolve(rootPath, `./public/jsItems/${itemName}.js`)
        const originPath = path.resolve(rootPath, `./public/originValue/${itemName}-origin.json`)
        const hash = hashOutput()
        const lockHash = hashOutput()

        API.findLineDocument(collUse, {
                name: {
                    $in: itemGroups
                }
            },
            async findItemMemberResult => {
                console.log('tag', itemGroups, findItemMemberResult)
                if (itemGroups.length && (!findItemMemberResult || findItemMemberResult.length < itemGroups.length)) {
                    // some other not exist!
                    res.send(msg(199, '部分用户未存在'))
                } else {
                    // need to update groups 
                    API.insertOneDocument(collDoc, {
                        hash,
                        ownName,
                        itemTitle,
                        itemName,
                        itemPath,
                        date,
                        originPath,
                        itemGroups,
                        lockHash
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
                }
            }
        )
    })

    routerRequest.post('/findItemByHash', async (req, res) => {
        const {
            hash,
            name
        } = req.body
        const collDoc = await collection('documents')
        console.log(111)
        // post msg: other enter the editer page
        io.on('connection', (socket) => {
            socket.emit('socketMsg', {
                hash,
                name,
                msg: `an user named ${name} enter the page`
            })
        })
        API.findLineDocument(collDoc, {
            hash
        }, findResult => {
            res.send(msg(200, 'success', findResult[0]))
        })
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
        console.log(req.body)
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
            itemGroups,
            lockHash
        } = req.body
        const collUse = await collection('users')
        const collDoc = await collection('documents')
        checkToken(req, res, jwt, name, jwtKey, async () => {
            API.findLineDocument(collUse, {
                    name: {
                        $in: itemGroups
                    }
                },
                findItemMemberResult => {
                    if (!findItemMemberResult || findItemMemberResult.length < itemGroups.length) {
                        // some other not exist!
                        res.send(msg(200, '部分用户未存在'))
                    } else {
                        API.findLineDocument(collUse, {
                            name
                        }, findResult => {
                            if (findResult[0].itemsHash.includes(hash)) {

                                API.findLineDocument(collDoc, {
                                    hash
                                }, findDocResult => {
                                    if (findDocResult[0].lockHash !== lockHash) {
                                        res.send(msg(200, '已有其他用户编辑过此项目请刷新读取最新数据'))
                                        return
                                    }
                                    // find delete mumbers
                                    const deleteMember = findDocResult[0].itemGroups.filter(i => !itemGroups.includes(i))
                                    // find add mumbers
                                    const addMember = itemGroups.filter(i => !findDocResult[0].itemGroups.includes(i))


                                    if (deleteMember.length || addMember.length) {
                                        // if itemGroups, checking name is owner?
                                        if (name !== findDocResult[0].ownName) {
                                            res.send(msg(200, '您没有权限修改组成员'))
                                            return
                                        }
                                    }
                                    // update collDoc itemGroups
                                    API.updateOneDocument(collDoc, {
                                        hash
                                    }, {
                                        $set: {
                                            itemGroups,
                                            lockHash: hashOutput()
                                        }
                                    }, async updateDocResult => {
                                        fs.writeFileSync(path.resolve(rootPath, `./public/jsItems/${itemTitle}-${hash}.js`), `var data_${itemTitle}_${hash.slice(0, 5)} = ${itemContent}`)
                                        fs.writeFileSync(path.resolve(rootPath, `./public/originValue/${itemTitle}-${hash}-origin.json`), originValue)
                                        // i delete name
                                        console.log(addMember, deleteMember)
                                        await API.updateDocument(collUse, {
                                            name: {
                                                $in: addMember
                                            }
                                        }, {
                                            $push: {
                                                itemsHash: hash
                                            }
                                        })
                                        await API.updateDocument(collUse, {
                                            name: {
                                                $in: deleteMember
                                            }
                                        }, {
                                            $pull: {
                                                itemsHash: hash
                                            }
                                        })
                                        res.send(msg(200, '修改完成'))
                                    })
                                })
                            } else {
                                res.send(msg(200, '修改失败,您无权限修改内容'))
                            }
                        })
                    }
                })
        })
    })
    return routerRequest
}