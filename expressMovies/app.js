const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const multer = require('multer')
const upload = multer()
const jwt = require('jsonwebtoken')
const cors = require('cors')

const port = 3000

let frenchMovies = []
// 'use()' permet de definir un middleware que l'on veut utliser
//'express.static' permet de servir tous les fichiers statique (css pdf ect...)
//présiser l'emplacement du dossier où sont stockés les fichiers statique
app.use('/public', express.static('public'))
app.use(cors())
//on stock bodyParser.urlencoded dans un constante afin de pouvoir le passer en paramètre
//sur les routes que l'on souhaite.
const urlEncodedParser = bodyParser.urlencoded({ extended: false })
// permet d'indiquer la route pour le stockage de nos views
app.set('views', './views')
//indique à espress que nos templates views seront faites ave ejs
app.set('view engine', 'ejs')

app.get('/movies', (req, res) => {
  const title = 'films francais des trentes dernières années'
  frenchMovies = [
    {
      title: "le fabuleux destin d'Amelie poulin",
      year: 2001,
    },
    {
      title: 'Buffet froid',
      year: 1979,
    },
    {
      title: 'le diner de con',
      year: 1998,
    },
    {
      title: "De rouille et d'os",
      year: 2012,
    },
  ]
  res.render('movies', { movies: frenchMovies, pagetitle: title })
})

// app.post('/movies', urlEncodedParser, (req, res) => {
//   console.log(req.body.movieTitle)
//   console.log(req.body.movieYear)
//   const newMovie = { title: req.body.movieTitle, year: req.body.movieYear }
//   frenchMovies = [...frenchMovies, newMovie]
//   console.log(frenchMovies)
//   res.sendStatus(201)
// })

app.post('/movies', upload.fields([]), (req, res) => {
  if (!req.body) {
    return res.sendStatus(500)
  } else {
    const formData = req.body
    console.log('formdata:', formData)
    const newMovie = { title: req.body.movieTitle, year: req.body.movieYear }
    //le spread operator permet de décomposer le tableau d'objet frenchMovies et le fait
    //de passer la constante newMovie en deuxieme parametre va créer un objet avec les données
    //de Newmovie dans le tableau de frenchMovies
    frenchMovies = [...frenchMovies, newMovie]
    res.sendStatus(201)
  }
})

app.get('/movies/add', (req, res) => {
  res.send("prochainement un formulaire d'ajout ici")
})

//route permetant d'afficher le film choisi par l'id passé en parametre dans l'url grasse au ':'
// on envoie à la template view des valeur en definisant un objet clef / valeur
app.get('/movies/:id/:title', (req, res) => {
  const id = req.params.id
  const title = req.params.title
  res.render('movieDetails', { movieid: id, movietitle: title })
})

// utiliser la methode 'render' pour renvoyer un template
app.get('/', (req, res) => {
  res.render('index')
})

app.get('/movie-search', (req, res) => {
  res.render('movie-search')
})

app.get('/login', (req, res) => {
  res.render('login', { title: 'connexion' })
})

const fakeUser = { email: 'test@testmail.fr', password: 'azerty' }
const secret =
  'qsdjS12ozehdoIJ123DJOZJLDSCqsdeffdg123ER56SDFZedhWXojqshduzaohduihqsDAqsdq'

app.post('/login', urlEncodedParser, (req, res) => {
  console.log('login post', req.body)
  if (!req.body) {
    return res.sendStatus(500)
  } else {
    if (
      fakeUser.email === req.body.email &&
      fakeUser.password === req.body.password
    ) {
      //permet de créer un token avec le contenu et la clef de hachage
      const myToken = jwt.sign(
        {
          iss: 'http://expressmovies.fr',
          user: 'Sam',
          scope: 'admin',
        },
        secret
      )
      res.json(myToken)
    } else {
      res.sendStatus(401)
    }
  }
})

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
