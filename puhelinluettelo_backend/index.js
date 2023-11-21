// Teht 3.6 puhelinluettelon backend step6
// uuden henkilön lisäyksen yhteydessä error-viestit:
// 1. nimi tai numero puuttuu
// 2. nimi on jo luettelossa
// testattu REST'in avulla toimivaksi

// Teht 3.5 puhelinluettelon backend step5
// mahdollistetaan tietojen lisääminen HTTP POST-req
// osoitteeseen http://localhost:3001/api/persons
// id generoidaan Math.randomilla
// toiminnallisuus oli jo aiemmin
// testattu HTTP POST-req toiminta


const express = require('express')
const app = express()

app.use(express.json())

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

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/info', (request, response) => {
  const numberOfContacts = persons.length
  const dateAtnow = new Date()
  const msg = `Phonebook has info for ${numberOfContacts} people\n` + `${dateAtnow}\n`

  response.set('Content-Type', 'text/plain')
  response.send(msg)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {    
    response.json(person)  
  } else {    
    response.status(404).end()  
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  
  response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})