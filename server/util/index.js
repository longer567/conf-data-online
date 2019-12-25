/**
 * 
 * @param {number} status 
 * @param {string} msg 
 * @param {object} data 
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

module.exports = {
    msg
}