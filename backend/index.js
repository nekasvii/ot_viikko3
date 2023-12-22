// Teht 3.15 puhelinluettelon ja tietokanta step3
// siirretty virhekäsittely middlewarelle

const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config() // ympäristömuuttuja käyttöön ennen ./models/person importtia

const Person = require('./models/person') // ottaa modulin käyttöön

app.use(cors())

app.use(express.static('dist'))
app.use(express.json((req, res, data) => {
  req.rawBody = data.toString();
}))
/*
morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const url = process.env.MONGODB_URI // url haetaan ympäristömuuttujasta
console.log('connecting to', url)
*/

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
/*
  const dublicatePerson = persons.find((person) => person.name === body.name)

  if (dublicatePerson) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }
*/
  const person =  new Person ({
    //id: generateId(),
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint) // middleware 404 virhekäsittelylle HUOM järjestys

const errorHandler = (error, request, response, next) => {
  // ...
}

app.use(errorHandler) // middleware virheellisille pyynnöille

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

// tallennettu henkilö MondoDB:stä JSON 
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else { // jos person=null 
        response.status(404).end() // 404 Not Found
      }
    })
    .catch(error => next(error)) // siirretään virhekäsittely middlewareen
  
})

// info page
app.get('/info', (request, response) => {
  Person.countDocuments().then(numberOfContacts => {
    const dateAtnow = new Date();
    const msg = `Phonebook has info for ${numberOfContacts} people\n${dateAtnow}\n`;
    response.set('Content-Type', 'text/plain');
    response.send(msg);
  }).catch(error => {
    console.error(error);
    response.status(500).send('Error retrieving data from the database');
  })
})

// henkilön poisto
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
  .then(result => {
    response.status(204).end() // 204 No Content 
  })
  .catch(error => next(error))
})