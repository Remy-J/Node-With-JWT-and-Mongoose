const express = require('express')
const app = express()

const port = 3000

// 'use()' permet de definir un middleware que l'on veut utliser
//'express.static' permet de servir tous les fichiers statique (css pdf ect...)
//présiser l'emplacement du dossier où sont stockés les fichiers statique
app.use('/public', express.static('public'))

// permet d'indiquer la route pour le stockage de nos views
app.set('views', './views')
//indique à espress que nos templates views seront faites ave ejs
app.set('view engine', 'ejs')

app.get('/movies', (req, res) => {
  res.render('movies')
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

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
