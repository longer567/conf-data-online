const express = require('express')
var bodyParser = require('body-parser')

const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const {
    routerPage
} = require('./router/routerPage')
const routerRequest = require('./router/routerRequest')(io)

app.use(express.static('public'))
app.set('view engine', 'pug')
app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))
app.use(routerPage)
app.use(routerRequest)

server.listen(3000, () => console.log('Example app listening on port 3000!'))