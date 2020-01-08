const uuidV4 = require('uuid/v4')
/**
 * 
 * @param {number} status status code for response
 * @param {string} msg message for response
 * @param {object} data data for response
 */
const msg = (status, msg, data) => {
    let temp = {
        status,
        msg
    }
    if (data !== undefined)
        temp.data = data
    return temp
}

/**
 * 
 * @param {object} req request for application
 * @param {object} res response for application 
 * @param {object} jwt jsonwebtoken
 * @param {string} name username (should equal decode token)
 * @param {string} jwtKey key for jwt
 * @param {() => {}} callback function callback run 
 */
const checkToken = (req, res, jwt, name, jwtKey, callback) => {
    const token = req.get("Authorization")
    if (token) {
        jwt.verify(token, jwtKey, (err, decodeToken) => {
            if (decodeToken === name) {
                callback()
            } else {
                // token失效（name token不符）
                res.send(msg(199, 'token失效'))
            }
        })
    } else {
        res.send(msg(199, '未登录'))
    }
}

const hashOutput = () => uuidV4().split('-').slice(0, 3).join('')

module.exports = {
    msg,
    checkToken,
    hashOutput
}