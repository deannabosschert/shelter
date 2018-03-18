<!-- lint disable no-html -->

# Shelter

> Online Animal Shelter- Express Server

*sidenote: the screenshot states 'localhost:1903' but my server actually listens to 'localhost:1902'*

![](screenshot.png)

![](screenshot-detail.png)

## Install

Fork this repository, `cd` into it, and:

```bash
npm install
npm run build # build and minify static files
npm start # runs server on `localhost:1902`

Don't forget:
npm install body-parser
```

## Description
This was an assignment by Titus Wormer (Amsterdam University of Applied Sciences); this was once a partially working server and it was up to me/us to fix it. For a full understanding of the assignment:
https://github.com/cmda-be/course-17-18/blob/master/week-4.md#shelter

## Solutions
I also added a howto.md file where I documented my thoughts and explanations.
Sadly, this document is in Dutch as it was easier for me and more understandable to my peers/teacher if I could just literally write down my process.


## Brief description of code

```txt
build.js - crawls new data (probably not needed)
db/data.json - raw data in json format
db/image/ - images for all animals
db/index.js - interface for accessing data
db/readme.md - docs for `db`
server/ - web server
server/helpers.js - utility functions used in the views to render animals
server/index.js - express server
src/index.css - unprocessed styles
src/index.js - unprocessed scripts
static/ - output of `src` after processing (these are sent to the browser)
view/detail.ejs - ejs template for one animal
view/list.ejs - ejs template for all animals
view/error.ejs - ejs template for errors
```

## Brief description of npm scripts

*   `npm start` — Start the server (on port 1902)
*   `npm test` — Tests the database
*   `npm run lint` — Check browser code and node code for problems
*   `npm run build` — Build browser code

## Data

Data is crawled (by `build.js`) from [nycacc][].
If you have the means to do so, you should consider becoming a foster parent,
volunteering at your local animal shelter, or donating!

## License

[MIT][] © [Titus Wormer][author]

[MIT][] © [Deanna Bosschert][student]

[mit]: license
[mit]: license

[author]: http://wooorm.com
[student]: http://deanna.nl

[assignment]: https://github.com/cmda-be/course-17-18/blob/master/week-4.md#shelter

## Sources
https://github.com/Marijnone/shelter/blob/master/server/index.js
https://github.com/cmda-be/shelter
https://github.com/cmda-be/shelter/tree/master/db#dbaddanimal
http://expressjs.com/en/4x/api.html#express

[nycacc]: http://nycacc.org
