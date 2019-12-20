/**
 * 
 * @param {string} url request url path
 * @param {object = ''} data request data
 * @param {string = GET} type request type
 */
const request = (url, data = "", type = "GET") => {
    return new Promise((resolve, reject) => {
        $.ajax({
            type,
            url,
            data,
            success(params) {
                resolve(params)
            },
            error(xhr, type) {
                reject(xhr, type)
            }
        })
    })
}

const API_BASE = '//localhost:3000/'
const api = {
    find: `${API_BASE}find`,
    addItem: `${API_BASE}addItem`
}
