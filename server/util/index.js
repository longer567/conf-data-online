/**
 * 
 * @param {number} status 
 * @param {string} msg 
 * @param {string} result 
 */
const msg = (status, msg, result) => {
    let temp = {
        status,
        msg
    }
    if (result !== undefined)
        temp.result = result
    return temp
}

module.exports = {
    msg
}