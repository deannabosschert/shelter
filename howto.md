# Solutions to this assignment
*special thanks to Folkert-Jan van der Pol*

Eerst alles forken, clonen, dan npm install.
Vervolgens als je een aanpassing hebt gemaakt: npm run build
Om de server vervolgens te starten: npm run start

Als je weer verder dingen wil doen in je terminal:  ctrl C

**Serving images does not work yet. Use express.static with app.use() to serve them.**
'''.use('/image', express.static('db/image'))'''
.use zorgt er voor dat ie luistert naar /image. Wanneer er een request op /image komt, voert ie express.static etc uit (callback).
In dit geval voert ie db/image uit maar dat zou bij wijze van ook een console.log kunnen zijn

^Dit gebeurt overigens binnen '''module.exports = express()'''
