// Teht 3.13 puhelinluettelon ja tietokanta step1
// jatketaan työskentelyä puhelinluettelon backendin kanssa
// tässä vaiheessa koodataan ohjelma hakemaan puh.numerot tietokannasta
// step2 puh.numerot myös tallennetaan tietokantaan 
// luotu oma moduulinsa ./models/person 
// tallennettu ympäristömuuttuja MONGODB_URI .env tiedostoon ja gitignorattu se

require('dotenv').config() // ympäristömuuttuja käyttöön ennen ./models/person importtia
const express = require('express')
const morgan = require('morgan')
const app = express()
const mongoose = require('mongoose')

const Person = require('./models/person') // ottaa modulin käyttöön

// app.use(express.json((req, res, data) => {
//   req.rawBody = data.toString();
// }))

// morgan.token('body', (req) => {
//   return req.method === 'POST' ? JSON.stringify(req.body) : ''
// })

// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const url = process.env.MONGODB_URI // url haetaan ympäristömuuttujasta
console.log('connecting to', url)

mongoose.connect(url) // yhdistetään haettuun urliin
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

mongoose.set('strictQuery', false)
mongoose.connect(url)

const PORT = process.env.PORT // portin aktivointi .env kautta
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

let persons = [  
]

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}

// henkilön lisäys
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }

  const dublicatePerson = persons.find((person) => person.name === body.name)

  if (dublicatePerson) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

// etusivu
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/favicon.ico', (req, res) => res.status(204)) // poistaa favicon.ico 404 virheilmon

// tallennetut henkilöt MondoDB:stä JSON 
app.get('/api/persons', (request, response) => {
  Person.find({}).then(person => {
    response.json(person)
  })
})

// info page
app.get('/info', (request, response) => {
  const numberOfContacts = persons.length
  const dateAtnow = new Date()
  const msg = `Phonebook has info for ${numberOfContacts} people\n` + `${dateAtnow}\n`

  response.set('Content-Type', 'text/plain')
  response.send(msg)
})

// tallennettu henkilö indeksissä x
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

/* ei vielä tarpeen
// henkilön poisto
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  
  response.status(204).end()
}) */