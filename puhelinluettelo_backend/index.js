// Teht 3.9 puhelinluettelon backend step8
// puhelinluettolon toiminnallisuus ajantasalle (ei numeromuutosta)
// eli aiemman kohdan 2.17 frontendin yhdistäminen kohdan 3.8 backendiin
// muokattu info sivun osoite ./info oli ./api/info

const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json((req, res, data) => {
  req.rawBody = data.toString();
}))

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


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

// tallennetut henkilöt JSON
app.get('/api/persons', (request, response) => {
  response.json(persons)
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