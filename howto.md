# Solutions to this assignment
*special thanks to Folkert-Jan van der Pol*

Eerst alles forken, clonen, dan `npm install.`
Vervolgens als je een aanpassing hebt gemaakt: `npm run build`
Om de server vervolgens te starten: `npm run start`

Als je weer verder dingen wil doen in je terminal:  ctrl C

### **Serving images does not work yet. Use express.static with app.use() to serve them.**
`.use('/image', express.static('db/image')) `
.use zorgt er voor dat ie luistert naar /image. Wanneer er een request op /image komt, voert ie express.static etc uit (callback).
In dit geval voert ie db/image uit maar dat zou bij wijze van ook een console.log kunnen zijn

^Dit gebeurt overigens binnen `module.exports = express()`

### **Implement GET /:id by rendering an animal with the view/detail.ejs template (tip: db.get()). Look at the implementation of GET / (the all function in the server) for inspiration.**
`.get('/:id', get)`          (de laatste get is de callback)

  Hiermee zorg je er voor dat de functie get wordt aangeroepen wanneer je request naar iets met / (slash) gaat. Wat na de slash komt wordt opgeslagen in je req.params.id (iets wat al bestaat binnen http)(id is op basis van de :id hierboven. Had ook johan kunnen zijn maar dan was het req.params.johan.) (hierdoor weet je dus wat er na de / komt)

  Hierna maak je de functie get aan.

```
function get(req, res){
    var id = req.params.id
    var result = {errors: [], data: db.get(id)}
    res.render('detail.ejs', Object.assign({}, result, helpers))
   }
 ```

  Standaard `(req, res)` erbij, vervolgens maak je de variabele id aan (is makkelijker dan telkens `req.params.id` typen)
  Dan de variabele result aanmaken: manier om je templatepagina te renderen; laat de templatepagina zien met de ingevulde data
  Hierna render je de bijbehorende detailpagina's met de data die dus uit db.get(id) komt, Object.assign voegt result en helpers samen, helpers is nodig om de templates te laden


  ### **Handle unfound animals (such as curl localhost:1902/123) by sending a 404 Not Found error back (tip: db.has()). Create an error object and render it in the view/error.ejs template. Look at view/error.ejs for how errors should look.**
Allereerst deze toevoegen aan het einde:

```
function notFound(err, req, res, next) {
    console.log(err)
  }
 ```

Dit is de allerlaatste error-afhandeling; als bepaalde errors niet in de code ervoor al worden afgehandeld, wordt de functie notFound geladen.
Wordt specifiek zo gedaan via:
```   .use(notFound) ```

Dan het 404 gedeelte, dit is de volledige code:

```
function get(req, res){
  var id = req.params.id
  var result = {errors: [], data: null} // db.get(id)
  var animalExists = db.get(id)
  if(!animalExists){
    result.errors.push({id: 404, title:'page not found'})
    res.status(404).render('error.ejs', Object.assign({}, result, helpers))
    return console.log(err)
  }
  result.data = db.get(id)
  res.render('detail.ejs', Object.assign({}, result, helpers))

}
```

Wat er nieuw is bijgekomen:
` var animalExists = db.get(id) `
Is voor de volgende opgave ook handig.
` var result = {errors: [], data: null} // db.get(id)` is aangepast
hierbij laat je errors open zodat je deze later weer aan kan roepen. Data wordt ook op null gezet (wordt later db.get(id)op aangeroepen)

Vervolgens,
```
if(!animalExists){
}
```

Hierbij wordt gezegd; indien animalExists niet bestaat, dan wordt het volgende uitgevoerd:

```
result.errors.push({id: 404, title:'page not found'})
res.status(404).render('error.ejs', Object.assign({}, result, helpers))
return console.log(err)
```

result.errors.push({id: 404, title:'page not found'}), dit pusht de errors van result, geeft hieraan een 404 en laat de foutmelding zeggen 'page not found'.
`res.status(404).render('error.ejs', Object.assign({}, result, helpers))`: bij de status 404, render je de errors van het bestand error.ejs.
return console.log(err): hiermee log je de errors naar je console

## *EDIT*:
```
function notFound(err, req, res, next) {
  console.log("Uncaught Error: ",err)
  showError(404,'page not found', res)

}
```

This does the trick too, en zo houd je het gewoon binnen de laatste afhandeling. Ook handiger voor de volgende opgave


### **Handle invalid identifiers (such as curl localhost:1902/-) by sending a 400 Bad Request error back.**
Hier ga je dus een errorafhandeling aanmaken wanneer er niet eens cijfers worden opgevraagd, maar bijv asdfghjkl.

de 400 is in de laatste errorafhandeling gestopt:

```
function notFound(err, req, res, next) {
  if (err.category === "invalid"){
    return showError(400, 'Bad Request', res)
  }
  showError(404,'page not found', res)

}
```

Kwam er hier achter dat je basically overal (res) achter moet zetten
Verder standaard functie aangemaakt voor de afhandeling van errors:

```
function showError(id, title, res){
  var errorObj = {
    id: id,
    title: title
  }
  var result = {errors: [errorObj], data: null}
  res.status(id).render('error.ejs', Object.assign({}, result, helpers))
}
```

### **Respond with JSON if requested on GET /:id. Look at the implementation of the all function for inspiration on how to respond with either HTML or JSON based on the request. Test it out with Curl: curl localhost:1902 and localhost:1902/88996 should return JSON.**

```
res.format({
    json: () => res.json(result),
    html: () => res.render('detail.ejs', Object.assign({}, result, helpers))
  })
```

Dit uit de comments gehaald, toegevoegd en in get gestopt.
In get stond al iets dat de HTML uitvoerde, dit knip je dus en plak je in bovenstaande code.

### **Implement DELETE /:id by removing an animal (tip: db.remove()). Respond with a 404 Not Found for unfound animals and a 400 Bad Request for invalid identifiers. Respond with a 204 No Content if successful. Note: you can just return JSON, as HTML forms don’t support DELETE. Test it out with Curl (curl --verbose --request DELETE localhost:1902/something) to see if 204 and 404 are returned. Note: restarting the server restores the removed animals.**

Bovenaan toegevoegd:  `  .delete('/:id', remove) `

Hierna de bijbehorende functie remove aangemaakt:
```
function remove(req, res){
  var id = req.params.id
  var animalExists = db.get(id)
  // console.log(animalExists)
  if(animalExists){
    db.remove(id)
    res.status(204).json(animalExists)
    console.log(animalExists)
  }
  else {
    showError(404,'page not found', res)
  }
}
```
Eerst maak je weer de variabele id aan (is makkelijker dan 'telkens' `req.params.id` typen)
Vervolgens de variabele `var animalExists = db.get(id) `, is duidelijker dan 'telkens' `db.get(id)`

`if(!animalExists){}` stelt letterlijk dat wanneer de functie remove uit wordt gevoerd en een dier gevonden is, db.remove(id) wordt toegepast. Hierna wordt de status 204 teruggegooid, evenals de ID behorende bij het geremovede dier.

Wanneer de functie remove wordt uitgevoerd maar er geen dier aanwezig is, wordt er een 404 teruggegooid.


### **Handle unfound animals that used to exist in GET /:id and DELETE /:id by sending a 410 Gone instead of 404 Not Found error back (tip: db.removed()).**

```
if(!animalExists){
    if (db.removed(id)) {
      return showError(410,'Gone', res)
    }
  }
  ```

Je zegt letterlijk dat als de id wel ooit bestaan heeft, dat je dan een 410 terug gooit.

### **Create a form and make it post to /. You can add an HTML file in static, or you could make it a view, but then you need to create a route that renders it. Add a link from the list to the new form. See the definition of Animal for which fields are needed, what values they can have, and whether they are required. There is CSS for forms and fields already, but if you’d like to add more make sure to do so in src/index.css and to run npm run build afterwards.**

## **Implement POST / to add an animal from the form (tip: db.add() and body-parser). You should clean the data sent to the server before passing it to db.add, as there are many cases where adding an animal can fail: such as when required fields are missing or if fields have a wrong data type (age and weight should be numbers, vaccinated and declawed a boolean, declawed must be undefined for dogs and rabbits, or when values are empty strings instead of undefined). Respond with a 422 Unprocessable Entity if the animal is invalid. Respond with a redirect to the animal if successful. Note: restarting the server removes the added animals.**

Ik had geen idee waar te beginnen dus ik ben eerst maar tientallen bestanden van anderen gaan bekijken om een beetje op een idee te komen, zo kwam ik op die van *Marijnone* terecht. Ik geloof dat ik de laastste twee bulletpoint ook door elkaar heb gemaakt.

Eerst body-parser geïnstalleerd mbv `npm install body-parser`

Ik heb eerst de data van de input gekopieerd van https://github.com/cmda-be/shelter/tree/master/db#dbaddanimal en toen aangepast naar een algemene input, met de code van Marijn er naast zodat ik ongeveer goed zou zitten.
```
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
   weight: parseInt(req.body.weight, 10),
   intakeDate: req.body.intake
  }
// explanation in the howto.md, inspiration/code from https://github.com/Marijnone/shelter/blob/master/server/index.js

  var animalAdd = db.add(input)
  if(animalAdd){
    res.redirect('/animalAdd/' + animalAdd.id)
  }
  else {
   showError(422,'422 Unprocessable Entity', res)
  }
}
```

Hierna de variabele animalAdd aangemaakt waardoor het dier wordt toegevoegd aan de database, en verder wordt in de if(animalAdd){} ervoor gezorgd dat dit dier ook daadwerkelijk toegevoegd wordt aan '/'. Wanneer de functie wel wordt uitgevoerd maar dit allen niet gebeurt, wordt er een 422 error terug gegooid.

Verder heb ik er voor gekozen om een nieuw view bestand (form.ejs) aan te maken aangezien dit meer binnen dezelfde lijn als het nu connecten van bestanden staat, waardoor ik dacht dat dit makkelijker te begrijpen zou zijn.

Ik heb deze als volgt gelinkt:

`.get('/form', form) ` als callback bovenaan de code toegevoegd.
Hierna de functie form gemaakt:
```
function form(req, res) {
    res.render('form.ejs')
}
```

Hierna ben ik begonnen met het invullen van het form.ejs bestand:
` deze ga ik niet geheel copyen aangezien dat niet veel toe zal voegen aan deze howto `

Normaal formulier toegevoegd binnen HTML structuur; radio buttons daar waar maar één keuze kan worden gemaakt, nummer daar waar een getal moet worden ingevuld, description daar waar een beschrijving moet worden toegevoegd, date daar waar een datum moet worden ingevuld.
Aan het einde van de code wordt de javascript pas geladen as always.

Als laatste heb ik nog geprobeerd om mijn server te vergelijken met dat van anderen (Jonah en Folkert), beide gecloned maar werkte voor geen meter aangezien zij wel al toegekomen zijn aan de Storage opdracht en er nog mee bezig zijn waarschijnlijk..


##### SOURCES:
 https://github.com/Marijnone/shelter/blob/master/server/index.js
 https://github.com/cmda-be/shelter
 https://github.com/Marijnone/shelter/blob/master/view/form.ejs
 https://github.com/cmda-be/shelter/tree/master/db#dbaddanimal
 http://expressjs.com/en/4x/api.html#express
