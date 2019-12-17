const path = require('path')
const viewsPath = (filename) => path.resolve(process.cwd() + '/views', filename)

module.exports = {
    indexPage(req, res){
        res.render(viewsPath('index'), {title: 'Hey', message: 'Hello there!'})
    },
    editerPage(req, res){
        res.render(viewsPath('editer.pug'))
    }
}