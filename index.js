// Teht 3.13 puhelinluettelon ja tietokanta step1
// jatketaan työskentelyä puhelinluettelon backendin kanssa
// tässä vaiheessa koodataan ohjelma hakemaan puh.numerot tietokannasta
// step2 puh.numerot myös tallennetaan tietokantaan 

// const express = require('express')
// const morgan = require('morgan')
// const app = express()
const mongoose = require('mongoose')

// app.use(express.json((req, res, data) => {
//   req.rawBody = data.toString();
// }))

// morgan.token('body', (req) => {
//   return req.method === 'POST' ? JSON.stringify(req.body) : ''
// })

// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const password = process.argv[2]

const url =
  `mongodb+srv://nellisviili:2nGbwsBjdgMKvjGH@cluster0.awpefb8.mongodb.net/` // TODO: ${password}

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    phonenumber: String,
})
  
const Person = mongoose.model('Person', personSchema)

let persons = [  
  {    
    id: 1, 
    name: "Arto Hellas",
    number: "040-123456",
  }, 
  {    
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  }, 
  {    
    id: 3,
    name: "Dan Abranov",
    number: "12-43-234345",
  }, 
  {    
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122",
  }
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

  persons = persons.concat(person)

  response.json(person)
})

// etusivu
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

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
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {    
    response.json(person)  
  } else {    
    response.status(404).end()  
  }
})

// henkilön poisto
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  
  response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})