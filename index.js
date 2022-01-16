const express = require('express')
const app = express()

app.use(express.json())
app.use(express.static('build'))

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  const today = new Date()
  res.send(`<p>Phonebook has info for ${persons.length} people</p>
  ${today}`)
  
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  console.log(person)
  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  
  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const data = req.body
  const person = {
    name: data.name,
    number: data.number,
    id: Math.ceil(Math.random()*1000)
  }
  if (!person.name){
    res.status(400).json({ error: 'name is missing' })
  }
  else if (!person.number){
    res.status(400).json({ error: 'number is missing' })
  } 
  else if (persons.find(temp => temp.name === person.name)){
    res.status(400).json({ error: 'name must be unique' })
  }
  else {
    persons = persons.concat(person)
    res.json(person)
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})