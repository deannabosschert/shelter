'use strict'

var express = require('express')
var db = require('../db')
var helpers = require('./helpers')

module.exports = express()
  .set('view engine', 'ejs')
  .set('views', 'view')
  .use(express.static('static'))
  .use('/image', express.static('db/image'))
  // TODO: Serve the images in `db/image` on `/image`.
  .get('/', all)
  .get('/:id', get)
  /* TODO: Other HTTP methods. */
  // .post('/', add)
  // .get('/:id', get)
  // .put('/:id', set)
  // .patch('/:id', change)
  // .delete('/:id', remove)
  .delete('/:id', remove)
  .use(notFound)
  .listen(1902)

function all(req, res) {
  var result = {errors: [], data: db.all()}

  /* Use the following to support just HTML:  */
  res.render('list.ejs', Object.assign({}, result, helpers))


}

function get(req, res){
  var id = req.params.id
  var result = {errors: [], data: null} // db.get(id)
  var animalExists = db.get(id)
  if(!animalExists){
    if (db.removed(id)) {
      return showError(410,'Gone', res)
    }
    showError(404,'page not found', res)
  }
  result.data = db.get(id)
  res.format({
    json: () => res.json(result),
    html: () => res.render('detail.ejs', Object.assign({}, result, helpers))
  })
}

function showError(id, title, res){
  var errorObj = {
    id: id,
    title: title
  }
  var result = {errors: [errorObj], data: null}
  res.status(id).render('error.ejs', Object.assign({}, result, helpers))
}

function remove(req, res){
  var id = req.params.id
  var animalDelete = db.remove(id)
  var animalExists = db.get(id)
  if(!animalExists){
    res.status(204).json(db.get(id))
  }
}



function notFound(err, req, res, next) {
  if (err.category === "invalid"){
    return showError(400, 'Bad Request', res)
  }
  console.log("Uncaught Error: ",err)
}
