const express = require('express')
const { routerPage } = require('./router/routerPage')
const { routerRequest } = require('./router/routerRequest')
var bodyParser = require('body-parser')

const app = express()

app.use(express.static('public'))
app.set('view engine', 'pug')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(routerPage)
app.use(routerRequest)

app.listen(3000, () => console.log('Example app listening on port 3000!'))