const express = require('express')
const app = express()
const { indexPage, editerPage } = require('./router/routerPage')

app.use(express.static('public'))
app.set('view engine', 'pug')
app.get('/', indexPage)
app.get('/editer', editerPage)

app.listen(3000, () => console.log('Example app listening on port 3000!'))