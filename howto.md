# Solutions to this assignment
*special thanks to Folkert-Jan van der Pol*

Eerst alles forken, clonen, dan ```npm install.```
Vervolgens als je een aanpassing hebt gemaakt: ```npm run build```
Om de server vervolgens te starten: ```npm run start```

Als je weer verder dingen wil doen in je terminal:  ctrl C

### **Serving images does not work yet. Use express.static with app.use() to serve them.**
``` .use('/image', express.static('db/image')) ```
.use zorgt er voor dat ie luistert naar /image. Wanneer er een request op /image komt, voert ie express.static etc uit (callback).
In dit geval voert ie db/image uit maar dat zou bij wijze van ook een console.log kunnen zijn

^Dit gebeurt overigens binnen ```module.exports = express()```

###**Implement GET /:id by rendering an animal with the view/detail.ejs template (tip: db.get()). Look at the implementation of GET / (the all function in the server) for inspiration.**
```  .get('/:id', get)  ```          (de laatste get is de callback)

  Hiermee zorg je er voor dat de functie get wordt aangeroepen wanneer je request naar iets met / (slash) gaat. Wat na de slash komt wordt opgeslagen in je req.params.id (iets wat al bestaat binnen http)(id is op basis van de :id hierboven. Had ook johan kunnen zijn maar dan was het req.params.johan.)(hierdoor weet je dus wat er na de / komt)

  Hierna maak je de functie get aan.

``` function get(req, res){
    var id = req.params.id
    var result = {errors: [], data: db.get(id)}
    res.render('detail.ejs', Object.assign({}, result, helpers))
   } ```

  Standaard ```(req, res)``` erbij, vervolgens maak je de variabele id aan (is makkelijker dan telkens ```req.params.id``` typen)
  Dan de variabele result aanmaken: manier om je templatepagina te renderen; laat de templatepagina zien met de ingevulde data
  Hierna render je de bijbehorende detailpagina's met de data die dus uit db.get(id) komt, Object.assign voegt result en helpers samen, helpers is nodig om de templates te laden


  ### **Handle unfound animals (such as curl localhost:1902/123) by sending a 404 Not Found error back (tip: db.has()). Create an error object and render it in the view/error.ejs template. Look at view/error.ejs for how errors should look.**
Allereerst deze toevoegen aan het einde:

```  function notFound(err, req, res, next) {
    console.log(err)
  } ```

Dit is de allerlaatste error-afhandeling; als bepaalde errors niet in de code ervoor al worden afgehandeld, wordt de functie notFound geladen.
Wordt specifiek zo gedaan via:
```   .use(notFound) ```

Dan het 404 gedeelte, dit is de volledige code:

``` function get(req, res){
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

} ```

Wat er nieuw is bijgekomen:
``` var animalExists = db.get(id) ```
Is voor de volgende opgave ook handig.
``` var result = {errors: [], data: null} // db.get(id)``` is aangepast
hierbij laat je errors open zodat je deze later weer aan kan roepen. Data wordt ook op null gezet (wordt later db.get(id)op aangeroepen)

Vervolgens,
``` if(!animalExists){
}  ```

Hierbij wordt gezegd; indien animalExists niet bestaat, dan wordt het volgende uitgevoerd:

``` result.errors.push({id: 404, title:'page not found'})
res.status(404).render('error.ejs', Object.assign({}, result, helpers))
return console.log(err) ```

result.errors.push({id: 404, title:'page not found'}), dit pusht de errors van result, geeft hieraan een 404 en laat de foutmelding zeggen 'page not found'.
res.status(404).render('error.ejs', Object.assign({}, result, helpers)): bij de status 404, render je de errors van het bestand error.ejs.
return console.log(err): hiermee log je de errors naar je console


### **Handle invalid identifiers (such as curl localhost:1902/-) by sending a 400 Bad Request error back.**
Hier ga je dus een errorafhandeling aanmaken wanneer er niet eens cijfers worden opgevraagd, maar bijv asdfghjkl.

de 400 is in de laatste errorafhandeling gestopt:

``` function notFound(err, req, res, next) {
  if (err.category === "invalid"){
    return showError(400, 'Bad Request', res)
  }
  console.log("Uncaught Error: ",err)
} ```

Kwam er hier achter dat je basically overal (res) achter moet zetten
Verder standaard functie aangemaakt voor de afhandeling van errors:

```function showError(id, title, res){
  var errorObj = {
    id: id,
    title: title
  }
  var result = {errors: [errorObj], data: null}
  res.status(id).render('error.ejs', Object.assign({}, result, helpers))
} ```

### **Respond with JSON if requested on GET /:id. Look at the implementation of the all function for inspiration on how to respond with either HTML or JSON based on the request. Test it out with Curl: curl localhost:1902 and localhost:1902/88996 should return JSON.**

```  res.format({
    json: () => res.json(result),
    html: () => res.render('detail.ejs', Object.assign({}, result, helpers))
  })
```

Dit uit de comments gehaald, toegevoegd en in get gestopt.
In get stond al iets dat de HTML uitvoerde, dit knip je dus en plak je in bovenstaande code.

### **Implement DELETE /:id by removing an animal (tip: db.remove()). Respond with a 404 Not Found for unfound animals and a 400 Bad Request for invalid identifiers. Respond with a 204 No Content if successful. Note: you can just return JSON, as HTML forms don’t support DELETE. Test it out with Curl (curl --verbose --request DELETE localhost:1902/something) to see if 204 and 404 are returned. Note: restarting the server restores the removed animals.**

dingetje bovenaan bij express toegevoegd
functie remove gemaakt, dingen van de voorbeeldserver in geflikkerd

dingen van de get functie hierin gecopied en get vervangen door delete (of kut moet dat remove zijn? thuis ff naar kijken, busleef)

### **Handle unfound animals that used to exist in GET /:id and DELETE /:id by sending a 410 Gone instead of 404 Not Found error back (tip: db.removed()).**

```  if(!animalExists){
    if (db.removed(id)) {
      return showError(410,'Gone', res)
    }
    showError(404,'page not found', res)
  } ```

Je zegt letterlijk dat als de id wel ooit bestaan heeft, dat je dan een 410 terug gooit.
