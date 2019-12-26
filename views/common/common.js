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
            headers: {
                "Authorization": window.localStorage.getItem('token')
            },
            success(params) {
                console.log(params)
                resolve(params)
            },
            error(xhr, type) {
                console.log(xhr)
                reject(xhr, type)
            }
        })
    })
}

const getUrlParams = (url, param) => (new URL(url)).searchParams.get(param)

const API_BASE = '//localhost:3000'
const api = {
    findUserAllItems: `${API_BASE}/findUserAllItems`,
    addItem: `${API_BASE}/addItem`,
    sign: `${API_BASE}/signUser`,
    login: `${API_BASE}/loginUser`,
}