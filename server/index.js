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
  .post('/', add)
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
  var animalExists = db.get(id)
  // console.log(animalExists)
  if(!animalExists){
    db.remove(id)
    res.status(204).json(animalExists)
    console.log(animalExists)
  }
  // else {
  //   showError(404,'page not found', res)
  // }
}

// copied the input from https://github.com/cmda-be/shelter/tree/master/db#dbaddanimal and edited it with help from https://github.com/Marijnone/shelter/blob/master/server/index.js
function add(req,res) {

  var input =
  { id: '18646',
   name: req.body.name,
   type: req.body.type,
   place: req.body.place,
   description: req.body.description,
   sex: req.body.sex,
   age: parseInt(req.body.age, 10),
   size: req.body.size,
   vaccinated: req.body.vaccinated == 1,
   primaryColor: req.body.primaryColor,
   secondaryColor: req.body.secondaryColor,
   weight: parseInt(req.body.weight,10),
   intakeDate: req.body.intake },

// explanation in the howto.md, inspiration/code from https://github.com/Marijnone/shelter/blob/master/server/index.js
   var animalAdd = db.add(input)
   if(animalAdd){   
     res.redirect('/animalAdd/' + animalAdd.id)
     else {
       showError(422,'422 Unprocessable Entity', res)
     }
   }
}

function notFound(err, req, res, next) {
  if (err.category === "invalid"){
    return showError(400, 'Bad Request', res)
  }
  showError(404,'page not found', res)

}
