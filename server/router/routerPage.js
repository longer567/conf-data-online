const path = require('path')
const express = require('express')
const routerPage = express.Router()
const viewsPath = (filename) => path.resolve(process.cwd() + '/views', filename)

routerPage.get('/', (req, res) => {
    res.redirect('/index')
})
routerPage.get('/index', (req, res) => {
    res.render(viewsPath('index'))
})
routerPage.get('/editer', (req, res) => {
    res.render(viewsPath('editer'))
})
routerPage.get('/login', (req, res) => {
    res.render(viewsPath('login'))
})

module.exports = {
    routerPage
}