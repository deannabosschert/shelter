# Solutions to this assignment
*special thanks to Folkert-Jan van der Pol*

Eerst alles forken, clonen, dan '''npm install.'''
Vervolgens als je een aanpassing hebt gemaakt: '''npm run build'''
Om de server vervolgens te starten: '''npm run start'''

Als je weer verder dingen wil doen in je terminal:  ctrl C

**Serving images does not work yet. Use express.static with app.use() to serve them.**
'''.use('/image', express.static('db/image'))'''
.use zorgt er voor dat ie luistert naar /image. Wanneer er een request op /image komt, voert ie express.static etc uit (callback).
In dit geval voert ie db/image uit maar dat zou bij wijze van ook een console.log kunnen zijn

^Dit gebeurt overigens binnen '''module.exports = express()'''

**Implement GET /:id by rendering an animal with the view/detail.ejs template (tip: db.get()). Look at the implementation of GET / (the all function in the server) for inspiration.**
'''  .get('/:id', get)  '''          (de laatste get is de callback)

  Hiermee zorg je er voor dat de functie get wordt aangeroepen wanneer je request naar iets met / (slash) gaat. Wat na de slash komt wordt opgeslagen in je req.params.id (iets wat al bestaat binnen http)(id is op basis van de :id hierboven. Had ook johan kunnen zijn maar dan was het req.params.johan.)(hierdoor weet je dus wat er na de / komt)

  Hierna maak je de functie get aan.

'''function get(req, res){
    var id = req.params.id
    var result = {errors: [], data: db.get(id)}
    res.render('detail.ejs', Object.assign({}, result, helpers))
   }'''

  Standaard '''(req, res)''' erbij, vervolgens maak je de variabele id aan (is makkelijker dan telkens '''req.params.id''' typen)
  Dan de variabele result aanmaken: manier om je templatepagina te renderen; laat de templatepagina zien met de ingevulde data
  Hierna render je de bijbehorende detailpagina's, blabla object, roep je de variabele result aan, idk waar helpers voor staat


  **Handle unfound animals (such as curl localhost:1902/123) by sending a 404 Not Found error back (tip: db.has()). Create an error object and render it in the view/error.ejs template. Look at view/error.ejs for how errors should look.**

  
