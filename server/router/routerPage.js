const path = require('path')
const express = require('express')
const routerPage = express.Router()
const viewsPath = (filename) => path.resolve(process.cwd() + '/views', filename)

routerPage.get('/', (req, res) => {
    res.redirect('/index')
});
[{
    pagePath: '/index',
    renderPath: 'index'
}, {
    pagePath: '/editer',
    renderPath: 'editer'
}, {
    pagePath: '/login',
    renderPath: 'login'
}].forEach(i => {
    console.log(i)
    routerPage.get(i.pagePath, (req, res) => {
        res.render(viewsPath(i.renderPath))
    })
})

module.exports = {
    routerPage
}