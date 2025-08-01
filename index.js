const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

morgan.token('req-body', (req, res) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/info', (req, res) => {
    res.send(`
        <div>Phonebook has info for ${persons.length} people</div>
        <div>${new Date()}</div>
        `)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(p => p.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

const generateId = () => {
  return Math.floor(Math.random() * 100000).toString()
}

app.post('/api/persons', (req, res) => {
    const person = req.body

    if (!person.name) {
      return res.status(400).json({error: 'person must have name'})
    }

    if (!person.number) {
      return res.status(400).json({error: 'person must have number'})
    }

    if (persons.find(p => p.name === person.name)) {
      return res.status(400).json({error: 'name must be unique'})
    }

    person.id = generateId()

    persons = persons.concat(person)
    res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    
    persons = persons.filter(p => p.id !== id)
    
    res.status(204).end()
})

const PORT = 3001

app.listen(PORT, () => {
    console.log(`Server listenning on port ${PORT}`)
})